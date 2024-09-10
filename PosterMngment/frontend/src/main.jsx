import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, createRoutesFromElements, Route,} from 'react-router-dom';
import { RouterProvider,} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/loginScreen.jsx'
import { Provider } from 'react-redux';
import store from './store.js';
import RegisterScreen from './screens/RegisterScreen.jsx';
import UserListScreen from './screens/UpdateScreen.jsx';
import CampaignListScreen from './screens/updateCampaigns.jsx';
import CampaignCreationScreen from './screens/createCampaigns.jsx';
import ImagePoster from './components/imagePoster.jsx';
import CurrentCampaigns from './screens/currentCampaign.jsx';
import CampaignPage from './screens/campaignPage';
import UploadImage from './screens/uploadImage.jsx';
import SignupScreen from './screens/signupPage.jsx';
import CreateClientPage from './screens/createClientPage.jsx';
import UpdateClients from './screens/updateClients.jsx';
import EditUserScreen from './screens/EditUserScreen.jsx';
import EditCampaignScreen from './screens/EditCampaignPage.jsx';
import EditClientScreen from './screens/EditClientsScreen.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/create-user" element={<RegisterScreen/>}/> 
      <Route path="/users" element={<UserListScreen />} />
      <Route path="/users/:id/edit" element={<EditUserScreen />} />
      <Route path="/campaigns" element={<CampaignListScreen />} />
      <Route path="/campaigns/:id/edit" element={<EditCampaignScreen />} />
      <Route path="/update" element={<UserListScreen/>}/>
      <Route path='/update-camp' element={<CampaignListScreen/>}/>
      <Route path="/clients" element={<UpdateClients />} />
      <Route path="/clients/:id/edit" element={<EditClientScreen />}/>
      <Route path='/create-camp' element={<CampaignCreationScreen/>}/>
      <Route path='/create-images' element={<UploadImage/>}/>
      <Route path='/current-campaigns' element={<CurrentCampaigns/>}/>
      <Route path="/campaign/:campaignId" element={<CampaignPage/>}/>
      <Route path='/signup' element={<SignupScreen/>}/>
      <Route path='/create-client' element={<CreateClientPage/>}/>
      <Route path='/update-clients' element={<UpdateClients/>}/>

    </Route>
  )
);
// provider is a way to connect react and redux and makes store available to any connected components
// React.strictMode is a way to run checks and warnings for its descendants
ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store={store}> 
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
  </Provider>
);
