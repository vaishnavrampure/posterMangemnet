import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Button} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import axios from 'axios';
import { toast } from 'react-toastify'

const CurrentCampaigns = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [campaigns, setCampaigns] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showPaused, setShowPaused] = useState(false);
  const [clients, setClients] = useState([]);

  const fetchCampaigns = async () => {
      const activeClients = await fetchClients();
      const activeCampaigns = await fetchCampaignsByRole();
      const visibleCampaigns = activeCampaigns.filter(campaign => 
        activeClients.some(client => client.name === campaign.clientName && client.active)
      );
      setCampaigns(visibleCampaigns);
      setClients(activeClients);
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      const activeClients = data.filter(client => client.active); // Filter to get only active clients
      return activeClients;
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCampaignsByRole = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/campaigns/role', {
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
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchCampaigns(); // Ensure clients are fetched before campaigns
    }
  }, [userInfo]);

  const isWithinTwoWeeks = (completionDate) => {
    const twoWeeksLater = new Date(completionDate);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    return new Date() <= twoWeeksLater;
  };

  const downloadReport = async (campaignId, campaignName) => {
    try {
        const response = await fetch(`http://localhost:3000/api/campaigns/${campaignId}/report`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to download report');
        }
        console.log(response)
        const blob = await response.blob(); // Convert response to blob
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report-${campaignName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to download report');
    }
};

  const inProgressCampaigns = campaigns.filter(campaign => campaign.status === 'In Progress' && campaign.active);
  const completedCampaigns = campaigns.filter(campaign => campaign.status === 'Completed' && campaign.active && isWithinTwoWeeks(campaign.completionDate));
  const pausedCampaigns = campaigns.filter(campaign => campaign.status === 'Paused' && campaign.active);

  const showToggleButtons = pausedCampaigns.length > 0 || completedCampaigns.length > 0;

  return (
    <>
      {inProgressCampaigns.length > 0 && (
        <>
          <strong><p style={{ fontSize: '30px' }}>In Progress</p></strong>
          <CampaignTable campaigns={inProgressCampaigns} />
        </>
      )}

      {showToggleButtons && (
        <>
          <div className="mt-3 d-flex align-items-center">
            <span className="me-2">{showPaused ? 'Hide Paused' : 'Show Paused'}</span>
            <ToggleButton
              value={showPaused}
              onToggle={() => setShowPaused(!showPaused)}
            />
          </div>
          {showPaused && pausedCampaigns.length > 0 && (
            <>
              <strong><p style={{ fontSize: '30px' }}>Paused</p></strong>
              <CampaignTable campaigns={pausedCampaigns} />
            </>
          )}

          <div className="mt-3 d-flex align-items-center">
            <span className="me-2">{showCompleted ? 'Hide Completed' : 'Show Completed'}</span>
            <ToggleButton
              value={showCompleted}
              onToggle={() => setShowCompleted(!showCompleted)}
            />
          </div>
          {showCompleted && completedCampaigns.length > 0 && (
            <>
              <strong><p style={{ fontSize: '30px' }}>Completed</p></strong>
              <CampaignTable campaigns={completedCampaigns} onDownloadReport={downloadReport} />
            </>
          )}
        </>
      )}
    </>
  );
};

const CampaignTable = ({ campaigns, onDownloadReport }) => (
  <Table className="mt-3">
    <thead>
      <tr>
        <th>Name</th>
        <th>Link</th>
        <th>Client Assigned</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {campaigns.map((campaign) => (
        <tr key={campaign._id}>
          <td><h4>{campaign.name}</h4></td>
          <td><Link to={`/campaign/${campaign._id}`}>View Details</Link></td>
          <td><h4>{campaign.clientName || 'N/A'}</h4></td>
          <td><h4>{campaign.status}</h4></td>
          <td>
            {campaign.status === 'Completed' && (
              <Button onClick={() => onDownloadReport(campaign._id, campaign.name)} variant="primary">
                Download Report
              </Button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default CurrentCampaigns;
