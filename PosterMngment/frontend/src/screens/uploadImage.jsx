import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  console.log(campaigns);

  useEffect(() => {
    if (userInfo) {
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

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }
    if (!selectedCampaignId) {
      toast.error("Please select a campaign first!");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('approved', false);
    formData.append('pending', true);
    formData.append('campaignID', selectedCampaignId);

    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      console.log(response); 
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      await response.json();
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image.');
    }
  };

  return (
    <div className="upload-image">
      <input type="file" onChange={handleChange} style={{ margin: '10px' }} />

      <select onChange={(e) => setSelectedCampaignId(e.target.value)}>
        <option value="">Select a Campaign</option>
        {campaigns.map(campaign =>
          campaign.assignedContractors.includes(userInfo?._id) &&  campaign.status === 'In Progress' && (
            <option key={campaign._id} value={campaign._id}>
              {campaign.name}
            </option>
          )
        )}
      </select>

      <button style={{ marginLeft: '10px' }} onClick={handleSubmit}>
        Submit Image
      </button>
    </div>
  );
};

export default UploadImage;
