"use client";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import CustomButton from "../../components/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMovie, editMovie, uploadImage } from "../../api/mainApi";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import Image from "next/image";

type Inputs = {
  title: string;
  publishing_year: string;
  poster: FileList;
};

export default function EditMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");
  // @ts-ignore
  const { setToken } = useContext(AuthContext);
  const [posterUrl, setPosterUrl] = useState<string | null>(null); // Store the image preview URL
  const [initialPosterUrl, setInitialPosterUrl] = useState<string | null>(null); // Store initial poster URL from DB

  // Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    data: movie,
    isLoading,
    isError,
    isSuccess,
    error: errorMovie,
  } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () =>
      getMovie({
        id: movieId,
      }),
    enabled: !!movieId,
  });

  useEffect(() => {
    if (isSuccess && !isLoading) {
      reset({
        title: movie?.title,
        publishing_year: movie?.publishing_year,
      });
      setInitialPosterUrl(movie?.poster_url);
    }
  }, [isLoading]);

  // Watch for changes in the poster input
  const watchTitle = watch("title");
  const watchPublishingYear = watch("publishing_year");

  // Generate a preview URL when a file is selected
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterUrl(URL.createObjectURL(file)); // Create a temporary URL for the selected image
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.poster && data.poster.length > 0) {
      // Step 1: Upload image if a new one is selected
      const formData = new FormData();
      formData.append("file", data.poster[0]);
      // @ts-ignore
      uploadImageMutation.mutate({
        asset_type: "movies",
        body: formData,
      });
    } else {
      // Step 2: If no new image is selected, update the movie directly
      // @ts-ignore
      updateMovieMutation.mutate({
        title: watchTitle,
        publishing_year: watchPublishingYear,
        poster_url: initialPosterUrl,
      });
    }
  };

  // Upload Image
  const uploadImageMutation = useMutation({
    mutationFn: (data) => uploadImage(data),
    onSuccess: (dataUpload) => {
      // Step 2: On Success, update movie with the new image
      const params = {
        title: watchTitle,
        publishing_year: watchPublishingYear,
        poster_url: dataUpload?.data,
        id: movieId,
      };
      // @ts-ignore
      updateMovieMutation.mutate(params);
    },
    onError(error: any) {
      // On error, show error
      console.log("Error uploading image", error);
    },
  });

  // Update Movie
  const updateMovieMutation = useMutation({
    mutationFn: (data) => editMovie(data),
    onSuccess: (response) => {
      // Step 3: Success, redirect
      router.push("/");
    },
    onError(error: any) {
      // Show error
      console.log("Update movie error", error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading movie data</div>;

  return (
    <>
      <Header showProfile={true}>Edit Movie</Header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6">
        <div className="flex items-start space-x-4">
          {/* Image Upload Box */}
          <div className="flex-shrink-0 w-1/3 h-80 border-dashed border-2 border-white rounded-lg relative flex items-center justify-center">
            {/* Image preview */}
            {posterUrl ? (
              <img
                src={posterUrl}
                alt="Selected Poster"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : initialPosterUrl ? (
              <Image
                src={`https://movies-next-demo.s3.eu-west-1.amazonaws.com/${initialPosterUrl}`}
                alt="Poster"
                className="object-cover w-full h-full rounded-lg"
                layout="fill"
              />
            ) : (
              <span className="text-white text-sm flex items-center justify-center h-full">
                Drag an image here
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              {...register("poster")}
              onChange={handleImageChange}
              className="absolute opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          {/* Form Inputs */}
          <div className="flex-1 space-y-4 px-5">
            <input
              type="text"
              placeholder="Title"
              {...register("title", { required: true })}
              className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
            />
            {errors.title && <p className="text-red-500">Title is required</p>}

            <input
              type="text"
              placeholder="Publishing year"
              {...register("publishing_year", {
                required: true,
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Publishing year must be a valid year (e.g., 1999)",
                },
              })}
              className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
            />
            {errors.publishing_year && (
              <p className="text-red-500">{errors.publishing_year.message}</p>
            )}

            <div className="space-x-4">
              <CustomButton
                buttonStyle="secondary"
                onClick={() => router.push("/")}
              >
                Cancel
              </CustomButton>
              <CustomButton
                buttonStyle="primary"
                type="submit"
                disabled={
                  uploadImageMutation.isPending || updateMovieMutation.isPending
                }
              >
                {uploadImageMutation.isPending
                  ? "Uploading Image ..."
                  : updateMovieMutation.isPending
                  ? "Updating Movie ..."
                  : "Update"}
              </CustomButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
