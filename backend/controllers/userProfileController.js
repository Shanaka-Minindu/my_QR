import db from "../config/db.js";

export const userDetails = async(req,res) =>{
 console.log(req.user.email);
 console.log(req.user.userName);
 console.log(req.user.createAt);

 const userEmail = req.user.email;
 const userName = req.user.userName;
 const createAt = req.user.createAt;

 try{
          const qrData = await db.query("SELECT * FROM qr_data WHERE email = $1",[userEmail]);
          console.log(qrData.rows);

          res.status(200).json({ 
                    user : {userEmail,
                              userName,
                              createAt   },
                   qrData:  qrData.rows
           });
 }catch(err){

 }









  
}