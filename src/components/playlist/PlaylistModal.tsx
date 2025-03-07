import React, { useCallback, useEffect, useState } from "react";
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

import { useAuth } from "@/contexts/AuthContext";
import { useCreatePlaylist } from "@/hooks/use-playlists";
import { useToast } from "@/hooks/use-toast";
import { useAddSongToPlaylist } from "@/hooks/use-playlists";

type Playlist = {
  name: string;
  description: string;
};

interface PlaylistModalProps {
  open: boolean;
  songId?: string;
  addSongIdToCreatedPlaylist?: boolean;
  onOpenChange: (open: boolean) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  open,
  songId,
  addSongIdToCreatedPlaylist,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    mutate: createPlaylist,
    isPending,
    data: playlist,
  } = useCreatePlaylist();
  const { mutate: addSongToPlaylist } = useAddSongToPlaylist();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleFormSubmit: SubmitHandler<Playlist> = useCallback(
    async (data) => {
      if (!user) return;
      try {
        createPlaylist({
          ...data,
          userId: user.id,
          coverFile: coverFile,
        });

        if (addSongIdToCreatedPlaylist && playlist?.id) {
          // Add song to newly created playlist
          addSongToPlaylist({ songId, playlistId: playlist.id });
        }

        setCoverFile(null);
        setCoverPreview(null);

        toast({
          title: "Playlist created",
          description: "Your new playlist has been created successfully",
        });
        reset();
        onOpenChange(false);
      } catch (error) {
        console.error("Error creating playlist:", error);
        toast({
          title: "Error",
          description: "Failed to create playlist. Please try again.",
          variant: "destructive",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      addSongIdToCreatedPlaylist,
      songId,
      playlist,
      createPlaylist,
      addSongToPlaylist,
    ]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {coverPreview ? (
              <img
                src={coverPreview}
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

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Playlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistModal;
