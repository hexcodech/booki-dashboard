import {API_URL, API_VERSION} from "./Constants.js"

class Utilities{
	
	static formatBytes(bytes,decimals) {
		if(bytes == 0) return '0 Byte';
		let k = 1000; // or 1024 for binary
		let dm = decimals + 1 || 3;
		let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		let i = Math.floor(Math.log(bytes) / Math.log(k));
		
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
	
	static bindAll(object, functions){
		
		for(var i=0;i<functions.length;i++){
			
			try{
				object[functions[i]] = object[functions[i]].bind(object);
			}catch(e){
				throw new Error("Can't bind method " + (
					typeof functions[i] === "function" ?
						functions[i].name : functions[i]) + " to " +
							(functions[i].name ? functions[i].name : "?"));
			}
		}
	}
	
	static getAllMethods(obj){
	    let props = [];
	
	    do {
	        const l = Object.getOwnPropertyNames(obj)
	            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
	            .sort()
	            .filter((p, i, arr) =>
	                typeof obj[p] === 'function' &&  //only the methods
	                p !== 'constructor' &&           //not the constructor
	                (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
	                props.indexOf(p) === -1          //not overridden in a child
	            );
	        props = props.concat(l);
	    }
	    while (
	        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
	        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
	    )
	    
	    return props;
	}
	
	static getPropertyByString(obj, queryString){
		
		if(!obj){return false;}
		
		queryString = queryString.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		queryString = queryString.replace(/^\./, '');           // strip a leading dot
		
		let keys = queryString.split(".");
		
		let o = obj;
		for(let i=0;i<keys.length;i++){
			
			if(keys[i] in o){
				o = o[keys[i]];
			}else{
				return undefined;
			}
			
		}
		
		return o;
	}
	
	static updatePropertyByString(obj, queryString, newValue){
		queryString = queryString.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		queryString = queryString.replace(/^\./, '');           // strip a leading dot
		
		let keys = queryString.split(".");
		
		let o = obj;
		for(let i=0;i<keys.length;i++){
			
			if(keys[i] in o){
				
				if(typeof o[keys[i]] === "object" && !Array.isArray(o[keys[i]])){
					o = o[keys[i]];
				}else{
					o[keys[i]] = newValue;
					
					return true;
				}
				
			}else{
				if(i === (keys.length - 1)){
					o[keys[i]] = newValue;
					
					return true;
				}else{
					o[keys[i]] = {};
					o = o[keys[i]];
				}
			}
			
		}
		return false;
	}
	
	static getParameterByName(name, url){
		if (!url) {
			url = window.location.href;
		}
		name = name.replace(/[\[\]]/g, "\\$&");
		
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
			
		if (!results) return null;
		if (!results[2]) return '';
	    
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	static toQueryString(params){ //only for flat objects
		return Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
	}
	
	static fetchApi(path = "/", method = "GET", params = {}, accessToken = null, version = API_VERSION){
		
		return new Promise((resolve, reject) => {
			let http = new XMLHttpRequest();
		
			http.open(method, API_URL + (version ? "/v" + API_VERSION : '') + "/" + path, true);
			
			if(accessToken !== null){
				http.setRequestHeader("Authorization", "Bearer " + accessToken);
			}
			
			http.onreadystatechange = () => {
				if(http.readyState === 4){
					if(http.status === 200){
						resolve(
							JSON.parse(http.responseText)
						);
					}else{
						reject(Error("Error Code: " + http.status));
					}
				}
			}
			
			http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			http.send(JSON.stringify(params));
			
		});
	}
}

export default Utilities;