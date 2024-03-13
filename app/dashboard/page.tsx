"use client";

import Sidebar from "@/components/Sidebar";
import { Post } from "@/types/Post";
import { useState, useEffect } from "react";
import { RiArrowDownSFill, RiSearchLine } from "react-icons/ri";
import Firebase from "@/lib/firebase";
import Link from "next/link";
import { Spinner } from "@/components/Spinner";

const firebase = new Firebase();

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async (post_id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setIsLoading(true);
    await firebase.deletePost(post_id);

    const newPosts = [...posts].filter((post) => post.post_id != post_id);
    setPosts(newPosts);
    setIsLoading(false);
  };

  useEffect(() => {
    if (posts.length == 0) {
      firebase.getPosts().then((posts) => {
        if (posts.length > 0) {
          const sortedPosts = [...posts].sort((a: any, b: any) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA;
          });
          setPosts(sortedPosts);
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
          <div className="overflow-x-auto w-full h-full bg-white border border-[#D5D7D8] rounded-[10px]">
            <div className="min-w-[1068.8px] grid grid-cols-12 border-b border-[#BDBDBD] p-6">
              <h3 className="col-span-3 font-monts font-semibold text-sm text-start text-[#5C5C5C] px-4 pl-0">
                Timestamp
              </h3>
              <h3 className="col-span-1 font-monts font-semibold text-sm text-start text-[#5C5C5C] px-4">
                Subject
              </h3>
              <h3 className="col-span-3 font-monts font-semibold text-sm text-start text-[#5C5C5C] px-4">
                Message
              </h3>
            </div>

            <div className="lg:overflow-y-auto w-full max-h-[100vh] ">
              {posts.length == 0 ? (
                <div className="flex justify-center items-center p-6">
                  <h3 className="font-monts font-medium text-base text-center text-darkerGray">
                    There are no items to display.
                  </h3>
                </div>
              ) : (
                <>
                  {posts.map((row: Post, index) => (
                    <div
                      key={index}
                      className={`min-w-[1068.8px] grid grid-cols-12 p-6 ${
                        index < posts.length - 1
                          ? "border-b border-[#BDBDBD] "
                          : "border-none"
                      }  `}
                    >
                      <h3 className=" col-span-3 font-monts font-semibold text-sm text-darkerGray px-4 pl-0">
                        {row.timestamp}
                      </h3>
                      <h3 className=" col-span-1 font-monts font-semibold text-sm text-darkerGray px-4">
                        {row.subject}
                      </h3>
                      <h3 className="col-span-6 font-monts font-semibold text-sm text-darkerGray px-4 overflow-y-auto max-h-[5rem]">
                        {row.message}
                      </h3>
                      <h3 className=" col-span-1 font-monts font-semibold text-sm text-start text-darkerGray px-4">
                        <Link
                          href={"post/" + row.post_id}
                          className="font-monts font-semibold text-sm text-primaryBlue p-3 pl-0 hover:underline"
                        >
                          View
                        </Link>
                      </h3>
                      <h3 className=" col-span-1 font-monts font-semibold text-sm text-start text-darkerGray px-4">
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <p
                            onClick={() => onDelete(row.post_id)}
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
