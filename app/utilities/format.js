export const formatBytes = (bytes,decimals) => {
	if(bytes == 0) return '0 Byte';
	let k = 1000; // or 1024 for binary
	let dm = decimals + 1 || 3;
	let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}