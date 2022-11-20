import axios from 'axios'

const form = document.querySelector('form')!;
const addressInput = document.querySelector('#address')! as HTMLInputElement;

const GOOGLE_API_KEY = "";
const MAPBOX_ACCESS_TOKEN = "";

// declare var google: any;
declare var mapboxgl: any;

type GoogleGeocodingResponse = {
  results: {
    geometry: {
      location: {
        lat: number,
        lng: number
      }
    }
  }[],
  status: 'OK' | 'ZERO_RESULTS'
}

type MapboxGeocodingResponse = {
  features: {
    center: [number, number] // [lng, lat]
  }[],
  statusText: string
}



function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then((response) => {
      if(response.data.status !== "OK") {
        throw new Error('Cound not fetch location!')
      }
      const coordinates = response.data.results[0].geometry.location
      const map = new google.maps.Map(document.getElementById("gmap")!, {
        center: coordinates,
        zoom: 9,
      });
      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch(e => {
      console.error(e)
    })

  axios.get<MapboxGeocodingResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(enteredAddress)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`)
  .then(response => {
    if (response.statusText !== "OK") {
      throw new Error('Cound not fetch location!')
    }
    const coordinates = response.data.features[0].center

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6ZW5vaml5dSIsImEiOiJjbGFwc2hzbzMxY21lM3Z1cjFvYndiMW04In0.MjTkbbyTLllhuKKE6syXmg';
    const map = new mapboxgl.Map({
      container: 'mbmap', // container ID
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map);
  })
  .catch(e => console.error(e))


}

form.addEventListener('submit', searchAddressHandler);