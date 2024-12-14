function isValidUpi(upi) {
    // Regular expression for UPI ID validation
    const upiRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9]+$/;
    return upiRegex.test(upi); // Returns true if valid, false otherwise
}

export default isValidUpi;