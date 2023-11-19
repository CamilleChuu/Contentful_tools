const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; 

const accessToken = 'CFPAT-1Pp8VKHVly0Yf7uGufJuQ-GAQCM7PkdxJ8DEkaptbY8'; 
const spaceId = 'wos687bwltf5';
const environmentId = 'master'; 

app.use(bodyParser.json());
app.use(cors());

app.post('/update-content', (req, res) => {
  const { fieldId, value } = req.body;
  const entryId = '4PwGHCcyeNxN3JWMoJWVA6'; 
  const entryUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;

  axios.get(entryUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json'
    }
  })
  .then(response => {
    console.log(response.headers);
    console.log("end");
    // const version = response.headers['x-contentful-version']; (doesn't work)
    const version = response.data.sys.version;
    if (!version) {
        throw new Error("Version number not found in response headers");
    }
    
    const data = {
      fields: {
        food: {'en-US': req.body.food},
        entertainment: {'en-US': req.body.entertainment},
        housing: {'en-US': req.body.housing}
  
      }
    };

    return axios.put(entryUrl, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Version': version 
      }
    });
  })
  .then(updateResponse => {
    res.status(200).json({
      message: 'Entry updated successfully',
      data: updateResponse.data
    });
  })

  .catch(error => {
    console.error('Error updating entry:', error);
    if (error.response && error.response.data.sys.id === 'VersionMismatch') {
        console.error('Version mismatch error:', error.response.data);
      } else {
        console.error('Error updating entry:', error);
      }
      res.status(error.response ? error.response.status : 500).json({
        message: 'Error updating entry',
        error: error.message,
        details: error.response ? error.response.data : null
      });   
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

