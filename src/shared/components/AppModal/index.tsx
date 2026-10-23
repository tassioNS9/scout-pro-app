// components/PhotoSourceDialog.tsx
import type { ImagePickerOptions } from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useCamera } from "@/shared/hooks/useCamera";
import { useGallery } from "@/shared/hooks/useGallery";

const GALLERY_OPTIONS: ImagePickerOptions = {
  mediaTypes: ["images"], // versão antiga: ImagePicker.MediaTypeOptions.Images
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

const CAMERA_OPTIONS = {
  allowsEditing: true,
  aspect: [1, 1] as [number, number],
  quality: 0.8,
};

interface PhotoSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoSelected: (uri: string) => void;
  onRemovePhoto?: () => void;
  hasPhoto?: boolean;
}

export function AppModal({
  open,
  onOpenChange,
  onPhotoSelected,
  onRemovePhoto,
  hasPhoto = false,
}: PhotoSourceDialogProps) {
  const { openCamera, isLoading: isCameraLoading } = useCamera(CAMERA_OPTIONS);
  const { openGallery, isLoading: isGalleryLoading } =
    useGallery(GALLERY_OPTIONS);

  const isLoading = isCameraLoading || isGalleryLoading;

  const handleCamera = async () => {
    onOpenChange(false);
    const uri = await openCamera();
    if (uri) onPhotoSelected(uri);
  };

  const handleGallery = async () => {
    onOpenChange(false);
    const uri = await openGallery();
    if (uri) onPhotoSelected(uri);
  };

  const handleRemove = () => {
    onOpenChange(false);
    onRemovePhoto?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[400px] bg-scout-card">
        <DialogHeader>
          <DialogTitle className="text-scout-text">Foto de perfil</DialogTitle>
          <DialogDescription>
            Escolha de onde você quer importar a imagem.
          </DialogDescription>
        </DialogHeader>

        <View className="gap-3">
          <Button
            onPress={handleCamera}
            disabled={isLoading}
            className="flex-row gap-2"
          >
            <AntDesign name="camera" size={24} color="black" />
            <Text>Tirar foto</Text>
          </Button>

          <Button
            variant="outline"
            onPress={handleGallery}
            disabled={isLoading}
            className="flex-row gap-2"
          >
            <Entypo name="image" size={24} color="black" />
            <Text>Escolher da galeria</Text>
          </Button>

          {hasPhoto && onRemovePhoto && (
            <Button
              variant="destructive"
              onPress={handleRemove}
              disabled={isLoading}
              className="flex-row gap-2"
            >
              <Entypo name="trash" size={18} color="black" />
              <Text>Remover foto</Text>
            </Button>
          )}
        </View>
      </DialogContent>
    </Dialog>
  );
}
