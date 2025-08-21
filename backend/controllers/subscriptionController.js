import db from "../config/db.js";

export const allQrSub = async (req, res) => {
  const scans = req.body.scans;
  const price = req.body.price;
  const type = req.body.name;
  const userId = req.user.userId;
  const payPacType = req.body.type + "_" + req.body.name;
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + 1);
  console.log(req.body);

  try {
    const allQrResponse = await db.query(
      "INSERT INTO all_qr (userId, all_Ptype, scan_count, exp_data) VALUES ($1,$2,$3,$4) RETURNING scan_count, exp_data",
      [userId, type, scans, expDate]
    );

    const updateQrPackage = await db.query('UPDATE qr_data SET package_type = $1 WHERE user_id =$2 RETURNING id',['All_QR',userId])

    const payLogResponse = await db.query(
      "INSERT INTO pay_log (user_id, sub_Package, price) VALUES ($1,$2,$3) RETURNING user_id, price",
      [userId, payPacType, price]
    );

    const response = {
      user_id: payLogResponse.rows[0].user_id,
      price: payLogResponse.rows[0].price,
      exp_date: allQrResponse.rows[0].exp_data,
      scan_count: allQrResponse.rows[0].scan_count,
    };

    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
  }
};

export const singleQrSub = async (req,res) => {
  const scans = req.body.scans;
  const price = req.body.price;
  const type = req.body.name;
  const remainScanCount = parseInt( req.body.remainScanCount);
  const userId = req.user.userId;
  const qrId = req.body.qrId;
  const payPacType = req.body.type + "_" + req.body.name;
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + 1);
  console.log(remainScanCount + scans);

  try {
    const singleQrResponse = await db.query(
      "INSERT INTO single_qr (qr_id, single_Ptype, scan_count, exp_data) VALUES ($1,$2,$3,$4) RETURNING scan_count, exp_data",
      [qrId, type, scans+remainScanCount, expDate]
    );

    const updateQrPackage = await db.query('UPDATE qr_data SET package_type = $1, scan_count = $2 WHERE id =$3 RETURNING id',['Single_QR',scans+remainScanCount,qrId])

    const payLogResponse = await db.query(
      "INSERT INTO pay_log (user_id, sub_Package, price) VALUES ($1,$2,$3) RETURNING user_id, price",
      [userId, payPacType, price]
    );

    const response = {
      user_id: payLogResponse.rows[0].user_id,
      price: payLogResponse.rows[0].price,
      qrId : updateQrPackage.rows[0].id,
      exp_date: singleQrResponse.rows[0].exp_data,
      scan_count: singleQrResponse.rows[0].scan_count,
    };

    res.status(200).json({ response });
    
  } catch (err) {
    console.log(err);
  }
};
