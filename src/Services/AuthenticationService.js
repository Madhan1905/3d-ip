class AuthenticationService {
    storeUserToken(username) {
        sessionStorage.setItem('authenticatedUser',username);
    }
    getUserId() {
        let user = sessionStorage.getItem('authenticatedUser');
        if(user === null) {
            return false;
        } else {
            return true;
        }
    }
}

export default new AuthenticationService();