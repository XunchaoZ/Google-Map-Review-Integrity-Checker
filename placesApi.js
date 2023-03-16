const { Client } = require('@googlemaps/google-maps-services-js');

class PlacesAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // extract url to get review dict:
    /*    text:{author_name,
                author_url,
                language,
                original_language,
                profile_photo_rul,
                rating,
                relative_time_description,
                text,
                time,
                translated}
    */
    async getReviewsDict(url) {
        try {
            var reviewsDict = {};
            const name = decodeURIComponent(url.split("/").pop().split("@")[0].replace(/\+/g, " "));
            const lat = url.split(",")[0].split("@")[1];
            const lng = url.split(",")[1];
            const placeId = await placesAPI.getPlaceIdFromLatLng(lat, lng, name);
            const reviews = await placesAPI.getReviews(placeId);
            reviews.forEach(review => {
                reviewsDict[review.text] = review;
            });
            return reviewsDict;
        } catch (error) {
            console.error(error);
        }
    }


    // GET request to retrieve place_id using lat and lng with correct name
    async getPlaceIdFromLatLng(lat, lng, name) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=restaurant&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            var res = data.results[0].place_id;
            data.results.forEach(function(result) {
                if (result.name == name) {
                    res = result.place_id;
                }
            });
            return res;
        } catch (error) {
            console.error(error)
        }
        return 0;
    }

    // GET request to retrieve all reviews and their info for placeId
    async getReviews(placeId) {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.result.reviews;
        } catch (error) {
            console.error(error)
        }
        return 0;
    }
}


// apiKey is not expirable, can be used throughout running
const apiKey = 'AIzaSyA2ft9Ti0ILphcvqQF3qvHvjY35LOhQxdk';

// Sample usage: 
const placesAPI = new PlacesAPI(apiKey);
const url = "https://www.google.com/maps/place/Rose+Bakery+%26+Cafe/@43.4642986,-80.5231153,18z/data=!4m6!3m5!1s0x882b46ae49d69c17:0xd949247f34b9b696!8m2!3d43.55811!4d-79.642758!16s%2Fg%2F1tc_04hc";
async function myFunction() {
    const review = await placesAPI.getReviewsDict(url);
    console.log(review);
}
myFunction();
