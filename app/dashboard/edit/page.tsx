"use client";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/header";
import CustomButton from "../../components/button";
import CustomInput from "../../components/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMovie, editMovie, uploadImage } from "../../api/mainApi";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import Image from "next/image"; // Import the Image component

type Inputs = {
  title: string;
  publishing_year: string;
  poster: FileList;
};

export default function EditMoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");
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
      console.log("query successful", movie);
      reset({
        title: movie?.title,
        publishing_year: movie?.publishing_year,
      });
      setInitialPosterUrl(movie?.poster_url);
      console.log(
        "values set",
        watchTitle,
        watchPublishingYear,
        initialPosterUrl
      );
    } else {
      console.log("query failed or not started", isError, movie, errorMovie);
    }
  }, [isLoading]);

  // Watch for changes in the poster input
  const watchTitle = watch("title");
  const watchPublishingYear = watch("publishing_year");

  // Generate a preview URL when a file is selected
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("generating preview");
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
      console.log("data submitted", formData);
      uploadImageMutation.mutate({
        asset_type: "movies",
        body: formData,
      });
    } else {
      // Step 2: If no new image is selected, update the movie directly
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
      console.log("Update movie success", response);
      router.push("/"); // Redirect after successful submission
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-1 max-h-[calc(100vh-64px)] p-6">
          {/* Left Section - Drag and Drop */}
          <div className="flex-1 flex justify-center">
            <div className="w-1/2 h-1/2 border-dashed border-2 border-white bg-[#092C39] rounded-lg flex items-center justify-center relative">
              {/* Image preview */}
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt="Selected Poster"
                  className="object-cover w-full h-full rounded-lg"
                  layout="fill"
                />
              ) : initialPosterUrl ? (
                <Image
                  src={`https://movies-next-demo.s3.eu-west-1.amazonaws.com/${initialPosterUrl}`}
                  alt="Poster"
                  className="object-cover w-full h-full rounded-lg"
                  layout="fill"
                />
              ) : (
                <span className="text-white text-sm">Drag an image here</span>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("poster")}
                onChange={handleImageChange} // Handle image selection
                className="absolute opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>

          {/* Right Section - Form Inputs */}
          <div className="flex-1 pl-8 flex flex-col justify-between">
            <div className="space-y-6">
              <CustomInput
                placeholder="Title"
                inputType="text"
                name="title"
                register={register}
              />
              <CustomInput
                placeholder="Publishing year"
                inputType="text"
                name="publishing_year"
                register={register}
              />
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
                    uploadImageMutation.isPending ||
                    updateMovieMutation.isPending
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
        </div>
      </form>
    </>
  );
}
