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
    const alreadySubscribed = await db.query(
      "SElECT * FROM all_qr WHERE userId = $1",
      [userId]
    );

    if (alreadySubscribed.rowCount > 0) {
      const exsistingSubId = alreadySubscribed.rows[0].id;
      const currentScanCount = alreadySubscribed.rows[0].scan_count;
      const newScan = currentScanCount + scans;
      await db.query(
        "UPDATE all_qr SET all_Ptype = $1, scan_count = $2, exp_data = $3 WHERE id = $4",
        [type, newScan, expDate, exsistingSubId]
      );
    } else {
      const allQrResponse = await db.query(
        "INSERT INTO all_qr (userId, all_Ptype, scan_count, exp_data) VALUES ($1,$2,$3,$4) RETURNING scan_count, exp_data",
        [userId, type, scans, expDate]
      );
    }

    const updateQrPackage = await db.query(
      "UPDATE qr_data SET package_type = $1 WHERE user_id = $2 RETURNING id",
      ["All_QR", userId]
    );

    const payLogResponse = await db.query(
      "INSERT INTO pay_log (user_id, sub_Package, price) VALUES ($1,$2,$3) RETURNING user_id, price",
      [userId, payPacType, price]
    );

    const response = {
      user_id: payLogResponse.rows[0].user_id,
      price: payLogResponse.rows[0].price,
    };

    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
  }
};

export const singleQrSub = async (req, res) => {
  const scans = req.body.scans;
  const price = req.body.price;
  const type = req.body.name;

  const userId = req.user.userId;
  const qrId = req.body.qrId;
  const payPacType = req.body.type + "_" + req.body.name;
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + 1);


  try {
    const exisingQr = await db.query(
      "SELECT * FROM single_qr WHERE qr_id = $1",
      [qrId]
    );
var newScan = scans;
    

    if (exisingQr.rowCount > 0) {
        newScan = await exisingQr.rows[0].scan_count + scans;
      const exQrId = exisingQr.rows[0].id;
      
      await db.query(
        "UPDATE single_qr SET single_Ptype =$1, scan_count =$2, exp_data= $3 WHERE id =$4",
        [type, newScan, expDate, exQrId]
      );
    } else {
      await db.query(
        "INSERT INTO single_qr (qr_id, single_Ptype, scan_count, exp_data) VALUES ($1,$2,$3,$4) RETURNING scan_count, exp_data",
        [qrId, type, newScan, expDate]
      );
    }

    const updateQrPackage = await db.query(
      "UPDATE qr_data SET package_type = $1, scan_count = $2 WHERE id =$3 RETURNING id",
      ["Single_QR",newScan, qrId]
    );

    const payLogResponse = await db.query(
      "INSERT INTO pay_log (user_id, sub_Package, price) VALUES ($1,$2,$3) RETURNING user_id, price",
      [userId, payPacType, price]
    );

    const response = {
      user_id: payLogResponse.rows[0].user_id,
      price: payLogResponse.rows[0].price,
      qrId: updateQrPackage.rows[0].id,
    };

    res.status(200).json({ response });
  } catch (err) {
    console.log(err);
  }
};

export const allQrInfo = async (req, res) => {
  const userId = req.user.userId;

  try {
    const allQrInfo = await db.query(
      "SELECT all_Ptype, scan_count, sub_data, exp_data FROM all_qr WHERE userid = $1",
      [userId]
    );
    res.status(200).json(allQrInfo.rows[0]);
  } catch (err) {
    console.log(err);
  }
};
