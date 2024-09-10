import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";
import CurrentCampaigns from "../screens/currentCampaign";

const ImagePoster = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  useEffect(() => {
    if (userInfo) {
      fetchImages();
      fetchCampaigns();
    }
  }, [userInfo]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('campaignID', selectedCampaignId);

    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      toast.success('Image uploaded successfully!');
      fetchImages(); // Refresh the images after uploading
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image.');
    }
  };

  const handleApprove = async (imageId) => {
    try {
      await fetch(`http://localhost:5000/api/images/${imageId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      fetchImages();
    } catch (error) {
      console.error('Error approving the image:', error);
      toast.error('Failed to approve image.');
    }
  };

  const handleRejectClick = async (imageId) => {
    const reason = prompt("Please enter the reason for rejection:");

    if (!reason || reason.trim() === '') {
      toast.error('Rejection reason is required.');
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/images/${imageId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ note: reason })
      });
      fetchImages();
      toast.success('Image rejected successfully.');
    } catch (error) {
      console.error('Error rejecting the image:', error);
      toast.error('Failed to reject image.');
    }
  };

  const toDoImages = images.filter(image => image.pending);
  const cardStyle = {
    margin: '10px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const imageStyle = {
    height: '300px',
    width: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  };

  return (
    <div className="app">
      {userInfo?.roles?.includes("Employee") && (
        <Card>
          <h2>Pending:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {toDoImages.map((image, key) => (
              <Card key={key} style={cardStyle}>
                <img
                  src={`http://localhost:5000/uploads/${image.largeName}`}
                  alt={image.largeName}
                  style={imageStyle}
                />
                <div className="button-container" style={buttonContainerStyle}>
                  {userInfo?.permissions?.includes("image_approval") && (
                    <>
                      <Button
                        style={{ height: '40px', width: '40px', backgroundColor: 'lightgreen', marginTop: '10px', }}
                        onClick={() => handleApprove(image._id)}
                      >
                        ✔
                      </Button>
                      <Button
                        style={{ height: '40px', width: '40px', backgroundColor: '#FFCCCB', marginTop: '10px', }}
                        onClick={() => handleRejectClick(image._id)}
                      >
                        ✘
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
      <CurrentCampaigns />
    </div>
  );
};

export default ImagePoster;
