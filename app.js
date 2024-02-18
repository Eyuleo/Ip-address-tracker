const ipInput = document.querySelector('#ip-input')
const submit = document.querySelector('#ip-lookup')
const ipAdress = document.querySelector('#ip-address')
const region = document.querySelector('#region')
const timezone = document.querySelector('#utc-timezone')
const isp = document.querySelector('#isp')

const getIp = async () => {
	try {
		const apiUrl = ipInput.value
			? `https://api.ipgeolocation.io/ipgeo?apiKey=fe761351d8564dc5b5e276537338aadc&ip=${ipInput.value}`
			: `https://api.ipgeolocation.io/ipgeo?apiKey=fe761351d8564dc5b5e276537338aadc`

		const res = await fetch(apiUrl)
		if (!res.ok) {
			throw new Error('Failed to fetch IP details')
		}
		const data = await res.json()
		ipInput.value = ''
		document.body.classList.remove('blurred')
		return data
	} catch (error) {
		alert('Error fetching IP:', error)
	}
}

const map = L.map('map').setView([0, 0], 2)
//setting the tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

//making custom marker
const customIcon = L.icon({
	iconUrl: '/images/icon-location.svg',
	iconSize: [30, 32],
	iconAnchor: [25, 16],
})
const marker = L.marker([0, 0], { icon: customIcon }).addTo(map)

//accesing DOM elements

const updateIpDetails = async () => {
	const data = await getIp()
	ipAdress.textContent = data.ip
	region.textContent = `${data.country_name} ${data.state_prov}`
	timezone.textContent = `UTC ${data.time_zone.offset}:00`
	isp.textContent = data.isp
	// Update map view and marker location
	map.setView([data.latitude, data.longitude], 10)
	marker.setLatLng([data.latitude, data.longitude])
}
submit.addEventListener('click', updateIpDetails)
document.addEventListener('DOMContentLoaded', async () => {
	await updateIpDetails()
})
