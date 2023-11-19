const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; 

const accessToken = 'CFPAT-1Pp8VKHVly0Yf7uGufJuQ-GAQCM7PkdxJ8DEkaptbY8'; 
const spaceId = 'wos687bwltf5';
const environmentId = 'master'; 
const entryId = '6lWpcR1OfEeOX7HSxDjQUS'; 
const entryUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`;

app.use(bodyParser.json());
app.use(cors()); 

app.get('/get-current-content', (req, res) => {
    axios.get(entryUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
    })
    .then(response => {
        res.status(200).json(response.data);
    })
    .catch(error => {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Error fetching entry' });
    });
});


app.post('/update-content', (req, res) => {
    console.log('Received data from client:', req.body); 
    axios.get(entryUrl, {
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
    })
    .then(response => {
        const currentData = response.data;
        const version = currentData.sys.version;
        const fieldsToUpdate = req.body;

        const data = {
            fields: currentData.fields
        };

        // Object.keys(fieldsToUpdate).forEach(fieldId => {
        //     if (fieldId in data.fields) {
        //         data.fields[fieldId]['en-US'] = fieldsToUpdate[fieldId];
        //     }
        // });
        data.fields.theCrazinessOfRyansHair = {
            'en-US': req.body.question1
        };
        data.fields.theNumberOfDogsInTheOffice = {
            'en-US': req.body.question2
        };
        data.fields.theCustomQualtricsOfficeDecor = {
            'en-US': req.body.question3
        };
        data.fields.theEnergyOfTheWorldClassSupportTeam = {
            'en-US': req.body.question4
        };

        console.log('Sending updated data to Contentful:', data);

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
        res.status(500).json({
            message: 'Error updating entry',
            error: error.message,
            details: error.response ? error.response.data : null
        });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

