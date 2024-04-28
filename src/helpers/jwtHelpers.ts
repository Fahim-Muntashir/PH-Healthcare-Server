import jwt, { JwtPayload ,Secret} from 'jsonwebtoken'

const genarateToken = (payload:any,secret:Secret,expiresIn:string) => {
    const token=   jwt.sign(payload,
           secret,
           {
           algorithm: 'HS256',
           expiresIn:expiresIn,
           });
       return token
}
const verifyToken = (token:string,secret:Secret) => {
  return  jwt.verify(token, secret) as JwtPayload;

} 

   
export  const jwtHelpers = {
    genarateToken,
    verifyToken,
};