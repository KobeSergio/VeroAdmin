"use client";

import Sidebar from "@/components/Sidebar";
import { Comment } from "@/types/Comment";
import { Post } from "@/types/Post";
import { useState, useEffect } from "react";
import { RiArrowDownSFill, RiSearchLine } from "react-icons/ri";
import Firebase from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Spinner } from "@/components/Spinner";
import { comment } from "postcss";

const firebase = new Firebase();

export default function Dashboard() {
  const { id } = useParams();

  const [post, setPost] = useState<Post>({} as Post);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    {
      name: "Home",
      route: "/dashboard",
    },
    {
      name: id,
    },
  ];

  const onDelete = async (index: any) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsLoading(true);

    //Remove comment from comment array and update to firebase
    const newComments = [...post.comments];
    newComments.splice(index, 1);

    await firebase.updatePost(id as string, {
      comments: newComments,
    });

    firebase.getPost(id as string).then((data) => {
      if (data) {
        setPost(data as Post);
        setFilteredComments(data.comments);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(post).length == 0) {
      firebase.getPost(id as string).then((data) => {
        if (data) {
          setPost(data as Post);
          setFilteredComments(data.comments);
        }
      });
    }
  }, []);

  return (
    <>
      <div className="min-h-[75vh] flex flex-col lg:flex-row gap-5">
        <aside className="w-full lg:w-1/4">
          <Sidebar />
        </aside>
        <div className="w-full flex flex-col gap-5">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="overflow-x-auto w-full h-full bg-white border border-[#D5D7D8] rounded-[10px]">
            <div className="min-w-[1068.8px] grid grid-cols-12 border-b border-[#BDBDBD] p-6">
              <h3 className="col-span-3 font-monts font-semibold text-sm text-start text-[#5C5C5C] px-4 pl-0">
                Timestamp
              </h3>
              <h3 className="col-span-3 font-monts font-semibold text-sm text-start text-[#5C5C5C] px-4">
                Message
              </h3>
            </div>

            <div className="lg:overflow-y-auto w-full max-h-[25rem] ">
              {filteredComments.length == 0 ? (
                <div className="flex justify-center items-center p-6">
                  <h3 className="font-monts font-medium text-base text-center text-darkerGray">
                    There are no items to display.
                  </h3>
                </div>
              ) : (
                <>
                  {filteredComments.map((row: Comment, index) => (
                    <div
                      key={index}
                      className={`min-w-[1068.8px] grid grid-cols-12 p-6 ${
                        index < filteredComments.length - 1
                          ? "border-b border-[#BDBDBD] "
                          : "border-none"
                      }  `}
                    >
                      <h3 className=" col-span-3 font-monts font-semibold text-sm text-darkerGray px-4 pl-0">
                        {row.comment_timestamp}
                      </h3>
                      <h3 className=" col-span-8 font-monts font-semibold text-sm text-darkerGray px-4">
                        {row.comment_message}
                      </h3>
                      <h3 className="col-span-1 font-monts font-semibold text-sm text-start text-darkerGray px-4">
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <p
                            onClick={() => onDelete(index)}
                            className="font-monts font-semibold text-sm text-red-700 pl-0 hover:underline cursor-pointer"
                          >
                            Delete
                          </p>
                        )}
                      </h3>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
