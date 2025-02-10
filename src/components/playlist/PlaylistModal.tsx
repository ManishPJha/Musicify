import React from "react";
import { Plus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Playlist = {
  name: string;
  description: string;
};

interface PlaylistModalProps {
  isCreatingPlaylist: boolean;
  onSubmit: SubmitHandler<Playlist>;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isCreatingPlaylist,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Playlist>();

  const handleFormSubmit: SubmitHandler<Playlist> = async (data) => {
    await onSubmit(data);
    reset(); // Reset the form after submission
  };

  return (
    <Dialog>
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
