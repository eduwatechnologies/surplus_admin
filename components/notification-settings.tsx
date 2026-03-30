"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
  type NotificationItem,
  updateNotification,
} from "@/lib/redux/slices/notificationSlice";

export function NotificationSettings() {
  const dispatch = useAppDispatch();
  const { items: notifications, isLoading: loading, error } = useAppSelector(
    (s) => s.notifications
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NotificationItem | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const isSaving = useMemo(() => loading && open, [loading, open]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setUserId("");
    setImageUrl("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (n: NotificationItem) => {
    setEditing(n);
    setTitle(n.title || "");
    setMessage(n.message || "");
    setUserId(n.userId || "");
    setImageUrl(n.imageUrl || "");
    setOpen(true);
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message are required");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
        userId: userId.trim() ? userId.trim() : null,
      };

      if (editing?._id) {
        await dispatch(
          updateNotification({ id: editing._id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createNotification(payload)).unwrap();
      }

      setOpen(false);
      resetForm();
    } catch (e: any) {
      return;
    }
  };

  const uploadImage = async (file: File) => {
    const toDataUrl = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image"));
        reader.readAsDataURL(f);
      });

    setIsUploadingImage(true);
    try {
      const base64 = await toDataUrl(file);
      const resp = await axiosInstance.post("/notifications/upload-image", {
        base64,
        contentType: file.type,
      });
      setImageUrl(String(resp.data?.imageUrl || ""));
    } catch (e: any) {
      alert(
        e?.response?.data?.error ||
          e?.message ||
          "Failed to upload notification image"
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await dispatch(deleteNotification(id)).unwrap();
    } catch (e: any) {
      return;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Create, edit, and delete push notifications.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch(fetchNotifications())}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={openCreate}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

          {loading && notifications.length === 0 ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <span className="text-sm text-muted-foreground">
                      No notifications yet.
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n._id}>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="max-w-[520px] truncate">
                      {n.message}
                    </TableCell>
                    <TableCell>
                      {n.userId ? `User: ${n.userId}` : "All users"}
                    </TableCell>
                    <TableCell>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(n)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700"
                            onClick={() => handleDelete(n._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) resetForm();
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden max-h-[85vh] flex flex-col">
          <div className="shrink-0 px-6 pt-6 pb-5 border-b bg-muted/40">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl">
                {editing ? "Edit Notification" : "Create Notification"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Send a push notification to all users or a specific user.
              </p>
            </DialogHeader>
          </div>

          <div className="min-h-0 overflow-y-auto">
            <div className="grid gap-6 p-6 md:grid-cols-5">
              <div className="md:col-span-3 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Content</p>
                    <p className="text-xs text-muted-foreground">
                      Keep it short so it displays nicely on the lock screen.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notificationTitle">Title</Label>
                    <Input
                      id="notificationTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Wallet funded successfully"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notificationMessage">Message</Label>
                    <Textarea
                      id="notificationMessage"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Targeting</p>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to send to all users.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notificationUserId">Target userId</Label>
                    <Input
                      id="notificationUserId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Optional userId"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold">Media</p>
                    <p className="text-xs text-muted-foreground">
                      Upload an image or paste an image URL.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notificationImageUrl">Image URL</Label>
                    <Input
                      id="notificationImageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadImage(file);
                        e.currentTarget.value = "";
                      }}
                      disabled={isUploadingImage || isSaving}
                    />
                    {imageUrl ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setImageUrl("")}
                        disabled={isUploadingImage || isSaving}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <p className="text-sm font-semibold">Preview</p>
                    <p className="text-xs text-muted-foreground">
                      {userId.trim() ? `User: ${userId.trim()}` : "All users"}
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-xs text-muted-foreground">Now</p>
                    </div>

                    {imageUrl ? (
                      <div className="rounded-lg border overflow-hidden bg-muted/20">
                        <img
                          src={imageUrl}
                          alt="Notification"
                          className="w-full h-28 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="rounded-lg border bg-muted/20 h-28" />
                    )}

                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-snug">
                        {title.trim() || "Notification title"}
                      </p>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {message.trim() ||
                          "Notification message preview will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 border-t bg-background flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving || isUploadingImage}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isSaving || isUploadingImage}
            >
              {isUploadingImage
                ? "Uploading image..."
                : editing
                ? "Save Changes"
                : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
