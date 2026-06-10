# TRON dApp (static) — WalletConnect v2 + Trust Wallet

Conținut:
- index.html — pagină statică pentru generare și trimitere a unei tranzacții TRC20 `approve` ABI-encoded.

Configurare:
- Project ID WalletConnect v2 setat în index.html: `dde98880530be70b65d01a1be59e5fa3`.
- Token USDT TRON setat: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`.
- Spender setat (router): `TN3ssBQjMsjsTyJkGL1hL7czsQjrjpePGu`.
- Amount prestabilit (raw bigint): `115792089237316195423570985008687907853269984665640564039457584007913129639935`.

Instrucțiuni:
1. Deschide `index.html` în browser (sau rulează un server static local).
2. Apasă "Conectare (QR)" și scanează cu Trust Wallet (WalletConnect).
3. Verifică preview-ul (token, spender, valoare raw).
4. Apasă "Solicită aprobare în Trust Wallet" și confirmă în wallet.

Notă importantă:
- Valoarea introdusă în câmpul "Valoare" din acest fișier este tratată ca raw bigint (fără conversie automată din zecimale). Ai furnizat deja valoarea raw; dacă dorești conversie din unități umane, actualizează câmpul sau modifică codul pentru scaling.
- Wallet-ul (Trust Wallet) va afișa detaliile finale înainte de semnare; semnarea are loc exclusiv în wallet.

Risc:
- Testează cu atenție; valoarea raw din exemplu e foarte mare (max uint256). Nu semna dacă nu înțelegi consecințele.
