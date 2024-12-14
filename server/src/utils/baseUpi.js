function extractBaseUpi(upi) {
     
    const match = upi.match(/^[a-zA-Z0-9]+/);
    return match ? match[0] : null;  
}

export default extractBaseUpi;