declare global {
	interface Window {
		location: Location;
	}
}

export {
	Window as WindowType,
	Location as LocationType,
	// Exporting the global types for better type inference in other files
	Window as GlobalWindow,
	Location as GlobalLocation,
};
