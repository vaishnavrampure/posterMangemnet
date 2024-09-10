import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CampaignPage = () => {
  const [images, setImages] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { campaignId } = useParams();

  useEffect(() => {
    if (userInfo) {
      fetchImages();
      fetchCampaign();
    }
  }, [userInfo]);

  // Fetch images
  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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

  // Fetch campaign details
  const fetchCampaign = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }

      const data = await response.json();
      setCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  // Handle image approval
  const handleApprove = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/images/${imageId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to approve image');
      }

      toast.success('Image approved successfully');
      fetchImages(); // Refresh the images
    } catch (error) {
      toast.error('Error approving image');
      console.error(error);
    }
  };

  // Handle image rejection
  const handleReject = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/images/${imageId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to reject image');
      }

      toast.success('Image rejected successfully');
      fetchImages(); // Refresh the images
    } catch (error) {
      toast.error('Error rejecting image');
      console.error(error);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  // Filter images related to the current campaign
  const completedImages = images.filter((image) => image.campaignID === campaign._id);

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

  const approvedImageStyle = {
    height: '40px',
    width: '40px',
    backgroundColor: 'green',
  };

  const rejectedImageStyle = {
    height: '40px',
    width: '40px',
    backgroundColor: 'red',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  };

  return (
      <div>
        <h1>{campaign.name}</h1>
        <div>
        {campaign.clientName && <p><strong>Client Name:</strong> {campaign.clientName}</p>}
        {campaign.company && <p><strong>Company:</strong> {campaign.company}</p>}
        {campaign.status && <p><strong>Status:</strong> {campaign.status}</p>}
        {campaign.city && <p><strong>City: </strong>{campaign.city}</p>}
        {campaign.neighborhood && <p><strong>Neighborhood: </strong>{campaign.neighborhood}</p>}
        {campaign.postersOrContacts && <p><strong># of posters: </strong>{campaign.postersOrContacts}</p>}
        {campaign.type && <p><strong>Type: </strong>{campaign.type}</p>}
        {campaign.quotedRate && <p><strong>Quoted Rate : </strong>{campaign.quotedRate}</p>}
      </div>
      <Link to={`/current-campaigns`}>Go Back</Link>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {completedImages.map((image, key) => (
          <Card key={key} style={cardStyle}>
            <img
    src={`http://localhost:5000/uploads/${image.mediumName}`}
    alt={image.imageName}
    style={imageStyle}
  />
            <div style={buttonContainerStyle}>
              {image.approved ? (
                <>
                  <Button style={approvedImageStyle} onClick={() => handleApprove(image._id)}>✔</Button>
                  <Button
                    className="btn btn-primary"
                    disabled
                    style={{ height: '40px', width: '40px', backgroundColor: 'red', marginLeft: '10px' }}
                  >
                    ✘
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="btn btn-primary"
                    disabled
                    style={{ height: '40px', width: '40px', backgroundColor: 'lightgreen', marginLeft: '10px' }}
                  >
                    ✔
                  </Button>
                  <Button style={rejectedImageStyle} onClick={() => handleReject(image._id)}>✘</Button>
                </>
              )}
            </div>
            {!image.approved && (
              <p style={{ marginTop: '30px', color: 'red', fontWeight: 'bold' }}>
                Reason: {image.description}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignPage;
