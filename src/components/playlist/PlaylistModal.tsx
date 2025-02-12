import React from "react";
import { useDropzone } from "react-dropzone";
import { Plus, Upload } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Playlist = {
  name: string;
  description: string;
};

interface PlaylistModalProps {
  isCreatingPlaylist: boolean;
  previewImageDataURL: string | null;
  onSubmit: SubmitHandler<Playlist>;
  setCoverFile: React.Dispatch<React.SetStateAction<File | null>>;
  setCoverPreview: React.Dispatch<React.SetStateAction<string | null>>;
  open: boolean; // Add this prop
  onOpenChange: (open: boolean) => void; // Add this prop
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isCreatingPlaylist,
  previewImageDataURL,
  onSubmit,
  setCoverFile,
  setCoverPreview,
  open, // Destructure the new prop
  onOpenChange, // Destructure the new prop
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Playlist>();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const handleFormSubmit: SubmitHandler<Playlist> = async (data) => {
    await onSubmit(data);
    reset(); // Reset the form after submission
    onOpenChange(false); // Close the modal after successful submission
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pt-4"
        >
          <Input
            placeholder="Playlist name"
            {...register("name", { required: "Playlist name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
          <Textarea
            placeholder="Description (optional)"
            {...register("description")}
          />

          {/* Dropzone for cover image */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <input {...getInputProps()} />
            {previewImageDataURL ? (
              <img
                src={previewImageDataURL}
                alt="Cover preview"
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drag & drop an image here, or click to select one
                </p>
                <p className="text-xs text-gray-400">
                  Recommended size: 500x500px
                </p>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isCreatingPlaylist}
          >
            {isCreatingPlaylist ? "Creating..." : "Create Playlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
