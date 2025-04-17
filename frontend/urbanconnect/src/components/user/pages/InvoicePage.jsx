"use client";

import { useRef, useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useNavigate } from "react-router-dom";

export default function InvoicePage() {
  const invoiceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    console.log("Checking route state and localStorage for invoice data");
    const { state } = location;
    console.log("Route state:", state);

    if (state) {
      if (state.invoiceService) {
        console.log(
          "Processing invoiceService from state:",
          state.invoiceService
        );
        setInvoiceData({
          company: {
            name: "Urban Connect Services",
            address: "123 Urban Street, Suite 101",
            city: "San Francisco, CA 94103",
            email: "billing@urbanconnect.com",
            phone: "+1 (555) 123-4567",
          },
          invoice: {
            number: `INV-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            dueDate: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
          },
          client: {
            name: "Customer Name", // Replace with authenticated user data if available
            address: "456 Client Avenue",
            city: "San Francisco, CA 94104",
            email: "customer@example.com",
          },
          payment: {
            bank: "Urban National Bank",
            account: "XXXX-XXXX-XXXX-1234",
            swift: "URBSFRXX",
          },
          items: [
            {
              id: state.invoiceService.id,
              description: state.invoiceService.name,
              price: state.invoiceService.price,
              quantity: 1,
              total: state.invoiceService.price,
              provider:
                state.invoiceService.stylist ||
                state.invoiceService.provider ||
                state.invoiceService.technician,
            },
          ],
          subtotal: state.invoiceService.price,
          tax: state.invoiceService.price * 0.1,
          discount: 0,
          total: state.invoiceService.price * 1.1,
          terms: [
            "Payment is due within 14 days of invoice date.",
            "Please make payment to the bank account specified above.",
            "Late payments are subject to a 5% fee.",
            "For questions regarding this invoice, please contact our billing department.",
          ],
          signature: {
            name: "Sarah Johnson",
            title: "Service Manager",
          },
        });
      } else if (state.invoiceData) {
        console.log("Processing invoiceData from state:", state.invoiceData);
        setInvoiceData({
          company: {
            name: "Urban Connect Services",
            address: "123 Urban Street, Suite 101",
            city: "San Francisco, CA 94103",
            email: "billing@urbanconnect.com",
            phone: "+1 (555) 123-4567",
          },
          invoice: {
            number: `INV-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            dueDate: new Date(
              Date.now() + 14 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
          },
          client: {
            name: "Customer Name", // Replace with authenticated user data if available
            address: "456 Client Avenue",
            city: "San Francisco, CA 94104",
            email: "customer@example.com",
          },
          payment: {
            bank: "Urban National Bank",
            account: "XXXX-XXXX-XXXX-1234",
            swift: "URBSFRXX",
          },
          items: state.invoiceData.items.map((item) => ({
            ...item,
            provider: item.provider || "Unknown",
          })),
          subtotal: state.invoiceData.items.reduce(
            (sum, item) => sum + item.total,
            0
          ),
          tax:
            state.invoiceData.items.reduce((sum, item) => sum + item.total, 0) *
            0.1,
          discount: 0,
          total: state.invoiceData.total * 1.1,
          terms: [
            "Payment is due within 14 days of invoice date.",
            "Please make payment to the bank account specified above.",
            "Late payments are subject to a 5% fee.",
            "For questions regarding this invoice, please contact our billing department.",
          ],
          signature: {
            name: "Sarah Johnson",
            title: "Service Manager",
          },
        });
      }
    } else {
      console.log("No state or localStorage data found");
      setInvoiceData(null);
    }
  }, [location]); // Use location as dependency to react to state changes

  if (!invoiceData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
          <p className="text-gray-600">
            No invoice data available. Please complete a payment first.
          </p>
          <button
            onClick={() => navigate("/browse")}
            className="mt-4 px-4 py-2 bg-[#1f2937] text-white rounded-md"
          >
            Go to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end gap-4 mb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Invoice
          </button>
          <button
            onClick={async () => {
              const element = invoiceRef.current;
              const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
              });
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
              });
              const imgWidth = 210;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
              pdf.save(`Invoice-${invoiceData.invoice.number}.pdf`);
            }}
            className="px-4 py-2 bg-[#1f2937] hover:bg-[#111827] text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Invoice
          </button>
        </div>

        <div
          ref={invoiceRef}
          className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-64 w-64 text-[#9ca3af] opacity-[0.03]"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM256 64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-96 96c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM96 256c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM160 352c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z" />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">
                {invoiceData.company.name}
              </h1>
              <address className="not-italic mt-2 text-[#6b7280]">
                <p>{invoiceData.company.address}</p>
                <p>{invoiceData.company.city}</p>
                <p>{invoiceData.company.email}</p>
                <p>{invoiceData.company.phone}</p>
              </address>
            </div>
            <div className="mt-6 md:mt-0 md:text-right">
              <h2 className="text-2xl font-bold text-[#111827]">INVOICE</h2>
              <div className="mt-2 text-[#6b7280]">
                <p>
                  <span className="font-medium text-[#111827]">
                    Invoice Number:
                  </span>{" "}
                  {invoiceData.invoice.number}
                </p>
                <p>
                  <span className="font-medium text-[#111827]">Date:</span>{" "}
                  {invoiceData.invoice.date}
                </p>
                <p>
                  <span className="font-medium text-[#111827]">Due Date:</span>{" "}
                  {invoiceData.invoice.dueDate}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                BILL TO:
              </h3>
              <div className="text-[#111827]">
                <p className="font-medium">{invoiceData.client.name}</p>
                <p>{invoiceData.client.address}</p>
                <p>{invoiceData.client.city}</p>
                <p>{invoiceData.client.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                PAYMENT METHOD:
              </h3>
              <div className="text-[#111827]">
                <p>
                  <span className="font-medium">Bank:</span>{" "}
                  {invoiceData.payment.bank}
                </p>
                <p>
                  <span className="font-medium">Account:</span>{" "}
                  {invoiceData.payment.account}
                </p>
                <p>
                  <span className="font-medium">SWIFT:</span>{" "}
                  {invoiceData.payment.swift}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 text-sm font-semibold text-[#111827] rounded-tl-md">
                    NO
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-[#111827]">
                    ITEM DESCRIPTION
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-[#111827] text-right">
                    PRICE
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-[#111827] text-right">
                    QTY
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-[#111827] text-right rounded-tr-md">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b border-[#e5e7eb]">
                    <td className="py-4 px-4 text-[#111827]">{item.id}</td>
                    <td className="py-4 px-4 text-[#111827]">
                      {item.description}
                    </td>
                    <td className="py-4 px-4 text-[#111827] text-right">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-[#111827] text-right">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-[#111827] text-right">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-sm font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
                TERMS & CONDITIONS:
              </h3>
              <ul className="text-sm text-[#6b7280] space-y-1">
                {invoiceData.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Subtotal:</span>
                  <span className="text-[#111827]">
                    ₹{invoiceData.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Tax (10%):</span>
                  <span className="text-[#111827]">
                    ₹{invoiceData.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Discount:</span>
                  <span className="text-[#111827]">
                    -₹{invoiceData.discount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-[#e5e7eb] pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-[#111827]">Total:</span>
                    <span className="text-[#111827]">
                      ₹{invoiceData.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-right">
                <div className="font-['Dancing_Script', cursive] text-xl text-[#111827]">
                  {invoiceData.signature.name}
                </div>
                <div className="text-sm text-[#6b7280] mt-1">
                  {invoiceData.signature.name}, {invoiceData.signature.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
