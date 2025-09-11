import { useRef } from "react";
import { Button } from "../ui/button";
import { Camera, Upload, X } from "lucide-react";
import { Badge } from "../ui/badge";

// Image Upload Component
const ImageUploader = ({ images, onImagesChange }) => {
  const fileInputRef = useRef(null);
  const maxImages = 10;

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    const totalImages = [...images, ...newImages];
    if (totalImages.length <= maxImages) {
      onImagesChange(totalImages);
    } else {
      alert(`You can only upload up to ${maxImages} images`);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-lg font-semibold text-gray-800">
            Property Images
          </label>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className="hover:bg-blue-50 hover:border-blue-300"
        >
          <Camera size={16} />
          Add Images ({images.length}/{maxImages})
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Property ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={12} />
              </button>
              {index === 0 && (
                <Badge className="absolute bottom-1 left-1 text-xs bg-blue-500">
                  Cover
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            Click "Add Images" to upload property photos
          </p>
          <p className="text-sm text-gray-500">JPG, PNG up to 5MB each</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
