"use client";
import React, { useContext, useState } from "react";
import Header from "../../components/header";
import CustomButton from "../../components/button";
import CustomInput from "../../components/customInput";
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
    console.log("generating preview");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPosterUrl(URL.createObjectURL(file)); // Create a temporary URL for the selected image
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //Step 1: Upload image
    const formData = new FormData();
    formData.append("file", data.poster[0]);
    console.log("data submitted", formData);
    uploadImageMutation.mutate({
      asset_type: "movies",
      body: formData,
    });
  };

  //Upload Image
  const uploadImageMutation = useMutation({
    mutationFn: (data) => uploadImage(data),
    onSuccess: (dataUpload) => {
      //Step 2: On Success, add movie with image to database
      const params = {
        title: watchTitle,
        publishing_year: watchPublishingYear,
        poster_url: dataUpload?.data,
      };
      addMutation.mutate(params);
    },
    onError(error: any) {
      //on error show error
      console.log("Error uploading image", error);
    },
  });

  // Queries - react-query
  //Mutation - Movies
  const addMutation = useMutation({
    mutationFn: (data) => addMovie(data),
    onSuccess: (response) => {
      //Step 3: Success, redirect
      console.log("Add movie success", response);
      router.push("/"); // Redirect after successful submission
    },
    onError(error: any) {
      //Show error
      console.log("Add movie error", error);
    },
  });

  return (
    <>
      <Header showProfile={true}>Create a New Movie</Header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-1 max-h-[calc(100vh-64px)] p-6">
          {/* Left Section - Drag and Drop */}
          <div className="flex-1 flex justify-center">
            <div className="w-1/2 h-1/2 border-dashed border-2 border-white bg-[#092C39] rounded-lg flex items-center justify-center relative">
              {/* Image preview */}
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt="Selected Poster"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <span className="text-white text-sm">Drag an image here</span>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("poster", { required: true })}
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
        </div>
      </form>
    </>
  );
}
