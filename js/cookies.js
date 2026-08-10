// ==========================================
// Cabinet Dr Ziane Khodja
// Version 7.0 — GA4 direct, sans bannière
// ==========================================

const GA_ID = "G-S65YXQMJTX";

// ── Chargement immédiat de GA4 ──────────────────────────────────────────────

(function() {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(script);

    script.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GA_ID, { send_page_view: true });
        initTracking();
    };
})();

// ── Fonction utilitaire d'envoi d'événement ─────────────────────────────────

function trackEvent(eventName, params) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params || {});
    }
}

// ── Tracking de tous les clics ──────────────────────────────────────────────

function initTracking() {

    // 1. APPELER
    document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_appeler", {
                event_category: "Contact",
                event_label: "Téléphone +213558456019",
                value: 1
            });
        });
    });

    // 2. WHATSAPP (hero + footer + flottant)
    document.querySelectorAll('a[href*="wa.me"]').forEach(function(el) {
        el.addEventListener("click", function() {
            var label = el.classList.contains("floating-wa")
                ? "WhatsApp flottant"
                : el.closest("footer") ? "WhatsApp footer" : "WhatsApp hero";
            trackEvent("click_whatsapp", {
                event_category: "Contact",
                event_label: label,
                value: 1
            });
        });
    });

    // 3. AVIS GOOGLE
    document.querySelectorAll('a[href*="g.page/r"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_avis_google", {
                event_category: "Réputation",
                event_label: "Laisser un avis Google",
                value: 2
            });
        });
    });

    // 4. FACEBOOK
    document.querySelectorAll('a[href*="facebook.com"]').forEach(function(el) {
        el.addEventListener("click", function() {
            trackEvent("click_facebook", {
                event_category: "Réseaux sociaux",
                event_label: "Page Facebook"
            });
        });
    });

    // 5. FICHES SERVICES
    document.querySelectorAll("a.service-card").forEach(function(el) {
        el.addEventListener("click", function() {
            var titre = el.querySelector("h3");
            var nom = titre
                ? titre.textContent.trim()
                : (el.getAttribute("href") || "").replace(".html","").replace(/-/g," ");
            trackEvent("click_service", {
                event_category: "Services",
                event_label: nom,
                value: 1
            });
        });
    });

    // 6. ANNUAIRES MÉDICAUX
    document.querySelectorAll("a.annuaire-item").forEach(function(el) {
        el.addEventListener("click", function() {
            var href = el.getAttribute("href") || "";
            var domain = href.replace(/^https?:\/\/(www\.)?/,"").split("/")[0];
            trackEvent("click_annuaire", {
                event_category: "Annuaires",
                event_label: domain
            });
        });
    });

    // 7. FAQ
    document.querySelectorAll(".faq-q").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var frSpan = btn.querySelector("span.fr");
            var question = frSpan ? frSpan.textContent.trim() : btn.textContent.trim();
            trackEvent("faq_ouverture", {
                event_category: "FAQ",
                event_label: question
            });
        });
    });

    // 8. CARROUSEL PHOTOS
    var prevBtn = document.getElementById("prev-btn");
    var nextBtn = document.getElementById("next-btn");
    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            trackEvent("carousel_navigation", {
                event_category: "Galerie",
                event_label: "Photo précédente"
            });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            trackEvent("carousel_navigation", {
                event_category: "Galerie",
                event_label: "Photo suivante"
            });
        });
    }

    // 9. NAVIGATION MENU
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(el) {
        el.addEventListener("click", function() {
            var frSpan = el.querySelector(".fr");
            var label = frSpan ? frSpan.textContent.trim() : el.textContent.trim();
            trackEvent("navigation_section", {
                event_category: "Navigation",
                event_label: label
            });
        });
    });

    // 10. SCROLL DEPTH (25 / 50 / 75 / 100%)
    var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener("scroll", function() {
        var h = document.body.scrollHeight - window.innerHeight;
        if (h <= 0) return;
        var pct = Math.round((window.scrollY / h) * 100);
        [25, 50, 75, 100].forEach(function(m) {
            if (pct >= m && !scrollMilestones[m]) {
                scrollMilestones[m] = true;
                trackEvent("scroll_depth", {
                    event_category: "Engagement",
                    event_label: m + "%",
                    value: m
                });
            }
        });
    }, { passive: true });

    // 11. TEMPS SUR PAGE (30s / 1min / 2min / 5min)
    [30, 60, 120, 300].forEach(function(secs) {
        setTimeout(function() {
            trackEvent("temps_sur_page", {
                event_category: "Engagement",
                event_label: secs >= 60 ? (secs / 60) + " min" : secs + "s",
                value: secs
            });
        }, secs * 1000);
    });
}