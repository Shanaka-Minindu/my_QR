import db from "../config/db.js";

export const QrUrlCreate = async (req, res) => {
  console.log(req.body.redirect_url);
  console.log(req.user.email);

  const redirect_url = req.body.redirect_url;
  const email = req.user.email || null;

  try {
    const reponse = await db.query(
      "INSERT INTO qr_data (scan_count, package_type, email, redirect_url) VALUES(50,'FREE',$1,$2) RETURNING id",
      [email, redirect_url]
    );
    console.log(reponse.rows);
    res.send(reponse.rows[0]);
  } catch (err) {}
};

export const FindRedirectUrl = async (req, res) => {
  const id = req.params.qid;
  
  try {
    const ridUrl = await db.query(
      "SELECT redirect_url FROM qr_data WHERE id = $1",
      [id]
    );

    
    res.status(200).json({url :ridUrl.rows[0].redirect_url })
  } catch (err) {}
};
