"use client";
import React, { useContext, useState } from "react";
import Header from "../../components/header";
import CustomButton from "../../components/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addMovie, uploadImage } from "../../api/mainApi";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

type Inputs = {
  title: string;
  publishing_year: string;
  poster: FileList;
};

export default function Page() {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);
  const [posterUrl, setPosterUrl] = useState<string | null>(null); // Store the image preview URL

  // Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

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
    // Step 1: Upload image
    const formData = new FormData();
    formData.append("file", data.poster[0]);
    uploadImageMutation.mutate({
      asset_type: "movies",
      body: formData,
    });
  };

  // Upload Image
  const uploadImageMutation = useMutation({
    mutationFn: (data) => uploadImage(data),
    onSuccess: (dataUpload) => {
      // Step 2: On Success, add movie with image to database
      const params = {
        title: watchTitle,
        publishing_year: watchPublishingYear,
        poster_url: dataUpload?.data,
      };
      addMutation.mutate(params);
    },
    onError(error: any) {
      // On error show error
      console.log("Error uploading image", error);
    },
  });

  // Queries - react-query
  // Mutation - Movies
  const addMutation = useMutation({
    mutationFn: (data) => addMovie(data),
    onSuccess: (response) => {
      // Step 3: Success, redirect
      router.push("/"); // Redirect after successful submission
    },
    onError(error: any) {
      // Show error
      console.log("Add movie error", error);
    },
  });

  return (
    <>
      <Header showProfile={true}>Create a New Movie</Header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start space-x-4 px-6">
          {/* Image Upload Box */}
          <div className="flex-shrink-0 w-1/3 h-80 border-dashed border-2 border-white rounded-lg relative flex items-center justify-center">
            {/* Image preview */}
            {posterUrl ? (
              <img
                src={posterUrl}
                alt="Selected Poster"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <span className="text-white text-sm flex items-center justify-center h-full">
                Drag an image here
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              {...register("poster", { required: true })}
              onChange={handleImageChange} // Handle image selection
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
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
                  uploadImageMutation.isPending || addMutation.isPending
                }
              >
                {uploadImageMutation.isPending
                  ? "Uploading Image ..."
                  : addMutation.isPending
                  ? "Submitting Movie ..."
                  : "Submit"}
              </CustomButton>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
