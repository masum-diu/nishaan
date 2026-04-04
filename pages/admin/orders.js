import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import supabase from "@/lib/createClient";
import jsPDF from "jspdf";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);


const generateOrderPDF = async (order) => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 30;

  const invoiceNumber = `INV-${Date.now()}-${order.id}`;

  // helpers
  const drawLine = (yPos) => {
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };
  const checkPage = () => {
    if (y > 780) { doc.addPage(); y = 40; }
  };

  // ---------------- LOGO + HEADER BAND ----------------
  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const [dr, dg, db] = [199, 171, 139]; // #c7ab8b

  doc.setFillColor(dr, dg, db);
  doc.rect(0, 0, pageWidth, 90, "F");

  const logoData = await loadImage("/assets/logo.png");
  if (logoData) {
    doc.addImage(logoData, "PNG", margin, 15, 55, 55, undefined, "FAST");
  }

  // Invoice # top-right
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`Invoice: ${invoiceNumber}`, pageWidth - margin, 30, { align: "right" });
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin, 44, { align: "right" });
  doc.text(`Order ID: ${order.id}`, pageWidth - margin, 58, { align: "right" });

  // Brand name right side of logo
  doc.setFontSize(24);
  doc.setTextColor(60, 35, 10);
  doc.setFont("helvetica", "bold");
  doc.text("Nishaans", margin + 65, 45);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Order Invoice", margin + 65, 62);

  y = 110;

  // ---------------- CUSTOMER INFO BOX ----------------
  doc.setFillColor(245, 248, 255);
  doc.roundedRect(margin, y, contentWidth, 90, 4, 4, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(dr, dg, db);
  doc.text("CUSTOMER INFORMATION", margin + 10, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);

  const col1x = margin + 10;
  const col2x = pageWidth / 2 + 10;

  doc.setFont("helvetica", "bold"); doc.text("Name:", col1x, y + 36);
  doc.setFont("helvetica", "normal"); doc.text(order.user_name || "-", col1x + 40, y + 36);

  doc.setFont("helvetica", "bold"); doc.text("Phone:", col1x, y + 52);
  doc.setFont("helvetica", "normal"); doc.text(order.phone_number || "-", col1x + 42, y + 52);

  doc.setFont("helvetica", "bold"); doc.text("Payment:", col2x, y + 36);
  doc.setFont("helvetica", "normal"); doc.text(order.payment_method || "-", col2x + 52, y + 36);

  if (order.payment_method === "bkash") {
    doc.setFont("helvetica", "bold"); doc.text("Bkash TxID:", col2x, y + 52);
    doc.setFont("helvetica", "normal"); doc.text(order.bkash_transaction_id || "-", col2x + 65, y + 52);
  }

  // Address — wrapped
  const fullAddress = `${order.address}, ${order.city}, ${order.postal_code}`;
  const addrLines = doc.splitTextToSize(`Address: ${fullAddress}`, contentWidth - 20);
  doc.setFont("helvetica", "normal");
  doc.text(addrLines, col1x, y + 68);

  y += 105;

  // ---------------- TABLE ----------------
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(dr, dg, db);
  doc.text("ORDER DETAILS", margin, y);
  y += 12;

  // Column x positions & widths
  const cols = {
    item:  { x: margin,       w: 160 },
    size:  { x: margin + 165, w: 55  },
    color: { x: margin + 225, w: 75  },
    qty:   { x: margin + 305, w: 35  },
    price: { x: margin + 345, w: 65  },
    total: { x: margin + 415, w: 65  },
  };

  // Table header row
  doc.setFillColor(dr, dg, db);
  doc.rect(margin, y, contentWidth, 22, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Item",    cols.item.x  + 4, y + 15);
  doc.text("Size",   cols.size.x  + 4, y + 15);
  doc.text("Color",  cols.color.x + 4, y + 15);
  doc.text("Qty",    cols.qty.x   + 4, y + 15);
  doc.text("Price",  cols.price.x + 4, y + 15);
  doc.text("Total",  cols.total.x + 4, y + 15);
  y += 22;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  order.items.forEach((item, idx) => {
    checkPage();
    const colorData = colors.find((c) => c.id === item.color);
    const sizeName = sizes.find((s) => s.id === item.size)?.name || String(item.size);
    const colorName = colorData ? colorData.name : "N/A";
    const price = calculateFinalPrice(item);
    const rowTotal = price * item.quantity;

    // Alternate row bg
    if (idx % 2 === 0) {
      doc.setFillColor(245, 248, 255);
      doc.rect(margin, y, contentWidth, 22, "F");
    }

    doc.setTextColor(40, 40, 40);
    const nameLines = doc.splitTextToSize(item.name, cols.item.w - 6);
    doc.text(nameLines[0], cols.item.x  + 4, y + 14);
    doc.text(sizeName,     cols.size.x  + 4, y + 14);

    // Color swatch circle + name
    if (colorData?.hex_code) {
      const hex = colorData.hex_code.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      doc.setFillColor(r, g, b);
      doc.setDrawColor(180, 180, 180);
      doc.circle(cols.color.x + 8, y + 10, 5, "FD");
      doc.setTextColor(40, 40, 40);
      doc.text(colorName, cols.color.x + 17, y + 14);
    } else {
      doc.text("N/A", cols.color.x + 4, y + 14);
    }

    doc.text(String(item.quantity), cols.qty.x + 4, y + 14);
    doc.text(`Tk ${price}`,     cols.price.x + 4, y + 14);
    doc.text(`Tk ${rowTotal}`,  cols.total.x + 4, y + 14);

    // bottom border
    doc.setDrawColor(220, 220, 220);
    // doc.line(margin, y + 22, pageWidth - margin, y + 22);
    // y += 22;
  });

  // ---------------- TOTALS ----------------
  y += 15;
  checkPage();

  // Delivery charge = total - sum of item totals
  const itemsSum = order.items.reduce(
    (acc, item) => acc + calculateFinalPrice(item) * item.quantity, 0
  );
  const deliveryCharge = order.total - itemsSum;

  const totalsX = pageWidth - margin - 180;
  doc.setFillColor(245, 248, 255);
  doc.roundedRect(totalsX, y, 180, deliveryCharge > 0 ? 62 : 42, 4, 4, "F");

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text("Items Subtotal:", totalsX + 8, y + 16);
  doc.text(`Tk ${itemsSum}`, pageWidth - margin - 8, y + 16, { align: "right" });

  if (deliveryCharge > 0) {
    doc.text("Delivery Charge:", totalsX + 8, y + 32);
    doc.text(`Tk ${deliveryCharge}`, pageWidth - margin - 8, y + 32, { align: "right" });
  }

  drawLine(y + (deliveryCharge > 0 ? 44 : 28));
  doc.setFont("helvetica", "bold");
  doc.setTextColor(dr, dg, db);
  doc.setFontSize(11);
  const grandY = y + (deliveryCharge > 0 ? 58 : 40);
  doc.text("Grand Total:", totalsX + 8, grandY);
  doc.text(`Tk ${order.total}`, pageWidth - margin - 8, grandY, { align: "right" });

  // ---------------- FOOTER ----------------
  y = grandY + 40;
  checkPage();
  drawLine(y);
  y += 14;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for shopping with Nishaans! ", pageWidth / 2, y, { align: "center" });

  doc.save(`${invoiceNumber}.pdf`);
};

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.log("Error fetching orders:", error.message);
    else setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) console.log("Error updating status:", error.message);
    else fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) console.log("Error deleting order:", error.message);
    else fetchOrders();
  };
  // fetch sizes and colors
  useEffect(() => {
    const fetchData = async () => {
      const { data: sizeData } = await supabase.from("sizes").select("id,name");

      const { data: colorData } = await supabase
        .from("colors")
        .select("id,name,hex_code");

      if (sizeData) setSizes(sizeData);
      if (colorData) setColors(colorData);
    };

    fetchData();
  }, []);

  const calculateFinalPrice = (item) => {
    if (!item.discount_type || !item.discount_value) return item.base_price;
    if (item.discount_type === "percentage")
      return item.base_price - (item.base_price * item.discount_value) / 100;
    if (item.discount_type === "fixed")
      return item.base_price - item.discount_value;
    return item.base_price;
  };
  if (loading)
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );

  if (orders.length === 0)
    return (
      <AdminLayout>
        <Typography variant="h5" mt={5} textAlign="center">
          No orders found.
        </Typography>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Orders
      </Typography>

      <Stack spacing={3}>
        {orders.map((order) => (
          <Paper
            key={order.id}
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#fdfdfd",
              position: "relative",
            }}
          >
            {/* Header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <Typography fontWeight="bold">Order ID: {order.id}</Typography>
              <Typography>Status: {order.status.toUpperCase()}</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => generateOrderPDF(order)}
              >
                Download PDF
              </Button>
              <Typography fontWeight="bold">Total: Tk {order.total}</Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* User Info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography>User: {order.user_name}</Typography>
                <Typography>
                  Address: {order.address}, {order.city}, {order.postal_code}
                </Typography>
                <Typography>Phone: {order.phone_number}</Typography>
                <Typography>
                  Date: {new Date(order.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography>Payment Method: {order.payment_method}</Typography>
                {order.payment_method === "bkash" && (
                  <Typography>
                    Bkash Transaction ID: {order.bkash_transaction_id}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Items */}
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Items:
            </Typography>
            <Stack
              spacing={1}
              sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}
            >
              {order.items.map((item) => {
                const colorData = colors.find((c) => c.id === item.color);
                return (
                  <Stack
                    key={item.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      border: "1px solid #eee",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={item.variant?.image_url || item.image}
                      alt={item.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <Box flexGrow={1}>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography>
                        Size:{" "}
                        {sizes.find((s) => s.id === item.size)?.name ||
                          item.size}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>Color:</Typography>

                        {colorData ? (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: colorData.hex_code,
                              border: "1px solid #ccc",
                            }}
                          />
                        ) : (
                          <Typography>N/A</Typography>
                        )}
                      </Stack>

                      <Typography>
                        Price: Tk {calculateFinalPrice(item)} x {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight="bold">
                      Tk {calculateFinalPrice(item) * item.quantity}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Actions */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              flexWrap="wrap"
            >
              {order.status === "pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus(order.id, "confirmed")}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => updateStatus(order.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteOrder(order.id)}
              >
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </AdminLayout>
  );
}
