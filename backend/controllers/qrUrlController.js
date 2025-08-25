import db from "../config/db.js";

export const QrUrlCreate = async (req, res) => {
  console.log(req.body.redirect_url);
  console.log(req.body.uid);

  const redirect_url = req.body.redirect_url;
  var uid = null;

  if (req.user) {
    uid = req.user.userId;
  } else {
    uid = req.body.uid;
  }

  if(!uid || !redirect_url){
    return res.status(400).json({ error: "Login error" });
  }

  var ptype = "Free";

  try {
    const isAallQr = await db.query("SELECT * FROM all_qr WHERE userid = $1", [
      uid,
    ]);

    if (isAallQr.rowCount > 0) {
      console.log(isAallQr.rowCount);
      ptype = "All_QR";
    }

    const response = await db.query(
      "INSERT INTO qr_data (scan_count, package_type, user_id, redirect_url) VALUES(50,$1,$2,$3) RETURNING id",
      [ptype, uid, redirect_url]
    );

    res.send(response.rows[0]);
  } catch (err) {}
};

export const FindRedirectUrl = async (req, res) => {
  const id = req.params.qid;

  const results = {
    url: "",
    advertisements: false,
  };

  try {
    const response = await db.query(
      "SELECT redirect_url, package_type, scan_count, user_id FROM qr_data WHERE id = $1",
      [id]
    );

    const packagetype = response.rows[0].package_type;
    const useId = response.rows[0].user_id;
    results.url = response.rows[0].redirect_url;

    console.log(response.rows[0]);

    if (packagetype === "All_QR") {
      const allQrResponse = await db.query(
        "SELECT id, scan_count, exp_data FROM all_qr WHERE userid = $1",
        [useId]
      );

      const allQrId = allQrResponse.rows[0].id;
      const allQrScans = allQrResponse.rows[0].scan_count;

      if (allQrResponse.rows[0].scan_count < 0) {
        results.advertisements = true;
      } else {
        await db.query("UPDATE all_qr SET scan_count = $1 WHERE id = $2", [
          allQrScans - 1,
          allQrId,
        ]);
      }
    } else if (packagetype === "Single_QR") {
      const singleQrRespone = await db.query(
        "SELECT id, scan_count, exp_data FROM single_qr WHERE qr_id = $1",
        [id]
      );

      const singleQrCount = singleQrRespone.rows[0].scan_count;
      const singleQrId = singleQrRespone.rows[0].id;

      if (singleQrRespone.rows[0].scan_count < 0) {
        results.advertisements = true;
      } else {
        await db.query("UPDATE single_qr SET scan_count = $1 WHERE id = $2", [
          singleQrCount - 1,
          singleQrId,
        ]);
        await db.query("UPDATE qr_data SET scan_count=$1 WHERE id = $2", [
          singleQrCount - 1,
          id,
        ]);
      }
    } else {
      const scan_count = response.rows[0].scan_count;

      if (0 > scan_count) {
        results.advertisements = true;
      } else {
        try {
          await db.query("UPDATE qr_data SET scan_count = $1 WHERE id = $2", [
            scan_count - 1,
            id,
          ]);
        } catch (err) {}
      }
    }
    console.log(results);
    res.status(200).json({ results });
  } catch (err) {}
};

export const updateUrl = async (req, res) => {
  const { id, newUrl, oldUrl } = req.body;

  if (newUrl !== oldUrl) {
    try {
      const response = await db.query(
        "UPDATE qr_data SET redirect_url = $1 WHERE id = $2",
        [newUrl, id]
      );
      res.send(response.rows[0]);
    } catch (err) {
      console.log(err);
    }
  }
};
