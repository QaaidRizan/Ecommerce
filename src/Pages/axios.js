
import axios from 'axios';



// GET request to fetch data
useEffect(() => {
    axios.get('http://localhost:8080/users/login')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching data:', error));
}, []);

// POST request to send data
const handlePostData = () => {
    axios.post('http://localhost:8080/db-api/login/users/login', postData)
        .then(response => setPostResponse(response.data))
        .catch(error => console.error('Error posting data:', error));
};