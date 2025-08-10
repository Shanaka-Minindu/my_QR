import db from "../config/db.js";
import bcrypt from "bcrypt";
export const userDetails = async (req, res) => {
  const userEmail = req.user.email;
  const userName = req.user.userName;
  const createAt = req.user.createAt;

  try {
    const qrData = await db.query(
      "SELECT id, scan_count as scancount, package_type as package, redirect_url as url FROM public.qr_data WHERE email = $1",
      [userEmail]
    );

    res.status(200).json({
      user: { userEmail, userName, createAt },
      qrData: qrData.rows,
    });
  } catch (err) {}
};

export const updateUser = async (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const email = req.user.email;
  const saltRounds = 10;

  const updatedFields = [];

  if (req.body.name !== undefined) {
    updatedFields.push(`username = '${req.body.name}'`);
  }
  if (req.body.password && req.body.newPassword === req.body.confirmPassword) {
    const curruntPass = await db.query("SELECT hash_password FROM users WHERE email = $1", [email]);
    const checkIsValid =await bcrypt.compare(req.body.password, curruntPass.rows[0].hash_password);

    if(checkIsValid){
        const newHash =  await bcrypt.hash(req.body.newPassword, saltRounds);
        updatedFields.push(`hash_password = '${newHash}'`);
    }else{
         return res.status(400).json({ error: "Currunt password is not matching.." });
    }
  }

  const query = `UPDATE users SET ${updatedFields.join(", ")} WHERE email = '${
    req.user.email
  }' RETURNING *`;
  console.log(query);
  const response = await db.query(query);

  console.log(response.rows);
};
