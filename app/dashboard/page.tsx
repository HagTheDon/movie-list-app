"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Header from "../components/header";
import Card from "../components/card";
import Button from "../components/button";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api/mainApi";
import Pagination from "../components/pagination";
import isAuth from "../components/isAuth";

const Page = () => {
  const router = useRouter();
  //track page
  const [page, setPage] = useState(1);
  //Queries & Mutations
  //Get Movies
  const { data, status } = useQuery({
    queryKey: ["movies", page],
    queryFn: () =>
      getMovies({
        page: page,
      }),
  });

  //Edit
  const onClickEdit = (id: string) => {
    router.push(`/dashboard/edit?id=${id}`);
  };

  return (
    <div className="min-h-screen">
      <Header showProfile={true} showAdd={true}>
        My Movies
      </Header>
      {status === "error" ? (
        <p className="text-white">Error loading ..</p>
      ) : status === "pending" ? null : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {data?.data?.data?.map((movie, index) => (
            <div onClick={() => onClickEdit(movie?.id)} key={index}>
              <Card
                key={index}
                title={movie?.title}
                publishing_year={movie?.publishing_year}
                poster_url={movie?.poster_url}
                poster_alt={movie?.poster_url}
              />
            </div>
          ))}
        </div>
      )}
      {status === "success" && (
        <Pagination
          currentPage={page}
          totalPages={data?.data?.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default isAuth(Page);
