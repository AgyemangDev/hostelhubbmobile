// hooks/hubclippsContext/useCreateHubclipp.js
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

export const useCreateHubclipp = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (payload) => {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken(false);

      console.log('=== FRONTEND CREATE DEBUG ===');
      console.log('Video URL:', payload.video_url);
      console.log('Image URL:', payload.front_image_url);

      // Create FormData for file upload
      const formData = new FormData();

      // Add video file
      if (payload.video_url) {
        const videoUri = payload.video_url;
        const videoName = videoUri.split('/').pop();
        
        const videoFile = {
          uri: videoUri,
          name: videoName,
          type: 'video/mp4',
        };
        
        console.log('Appending video:', videoFile);
        formData.append('video', videoFile);
      }

      // Add front image file
      if (payload.front_image_url) {
        const imageUri = payload.front_image_url;
        const imageName = imageUri.split('/').pop();
        
        const imageFile = {
          uri: imageUri,
          name: imageName,
          type: 'image/jpeg',
        };
        
        console.log('Appending image:', imageFile);
        formData.append('front_image', imageFile);
      }

      // Add all other text fields
      formData.append('poster_type', payload.poster_type);
      formData.append('hostel_name', payload.hostel_name);
      formData.append('category', payload.category);
      formData.append('room_type', payload.room_type);
      formData.append('price', payload.price.toString());
      formData.append('manager_or_porter_name', payload.manager_or_porter_name);
      formData.append('manager_or_porter_contact', payload.manager_or_porter_contact);
      formData.append('location', payload.location);
      formData.append('latitude', payload.latitude?.toString() || '0');
      formData.append('longitude', payload.longitude?.toString() || '0');
      formData.append('institution', payload.institution);
      formData.append('amenities', JSON.stringify(payload.amenities || []));
      formData.append('description', payload.description || '');

      console.log('Sending request to:', `${API_BASE_URL}/api/hubclipps`);

      const res = await fetch(`${API_BASE_URL}/api/hubclipps`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type - let fetch handle it for FormData
        },
        body: formData,
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const json = await res.json();
        console.log('Error response:', json);
        throw new Error(json.error || "Failed to create hubclipp");
      }

      const data = await res.json();
      console.log('Success! Created listing:', data.data?.id);
      return data.data;
    } catch (err) {
      console.error("Create hubclipp error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};