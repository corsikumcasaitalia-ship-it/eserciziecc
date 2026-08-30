/**
 * seviye_tespit_data.js — Seviye Tespit Sınavı ortak veri katmanı
 * ================================================================
 * Bu dosya hem test-editor.html (öğretmen paneli) hem de
 * seviye_tespit_sinavi.html (öğrenci sınavı) tarafından kullanılır.
 *
 * Veri, tarayıcının localStorage'ında saklanır. Öğretmen
 * test-editor.html üzerinden bölüm/soru ekler, düzenler veya siler;
 * hiçbir zaman kod veya arka yüzle uğraşmaz. Öğrenci sınavı açtığında
 * en güncel veri otomatik olarak localStorage'dan okunur.
 *
 * localStorage sadece kullanıldığı TARAYICIYA özeldir. Düzenlemeleri
 * başka bir bilgisayara/tarayıcıya taşımak ya da kalıcı olarak
 * yedeklemek için "Dışa Aktar" ile bir JSON dosyası indirilebilir,
 * bu dosya "İçe Aktar" ile başka bir tarayıcıya yüklenebilir.
 */

const TEST_DATA_STORAGE_KEY = 'seviye_tespit_test_data_v1';

const DEFAULT_TEST_DATA = {
    title: "İtalyanca Seviye Tespit Sınavı",
    description: "Sorulara sırayla cevap ver. Her bölümü geçtikçe bir sonraki, daha zor bölüme geçeceksin. Sonunda tahmini CEFR seviyen gösterilecek.",
    passThreshold: 60,
    sections: [
        {
            id: 's-a1',
            level: 'A1',
            title: 'Temel İfadeler ve Günlük Kelimeler',
            questions: [
                {
                    id: 'q-a1-1',
                    text: "Come ti chiami?",
                    options: ["Sto bene, grazie.", "Mi chiamo Marco.", "Ho ventidue anni.", "Sono di Roma."],
                    correct: 1
                },
                {
                    id: 'q-a1-2',
                    text: "Buongiorno! Come stai?",
                    options: ["Sono le nove.", "Bene, grazie, e tu?", "È lunedì.", "Piacere."],
                    correct: 1
                },
                {
                    id: 'q-a1-3',
                    text: "___ un libro sul tavolo.",
                    options: ["Ci sono", "C'è", "Sono", "È"],
                    correct: 1
                }
            ]
        },
        {
            id: 's-a2',
            level: 'A2',
            title: 'Geçmiş Zaman ve Günlük Rutin',
            questions: [
                {
                    id: 'q-a2-1',
                    text: "Ieri io ___ al cinema con i miei amici.",
                    options: ["vado", "sono andato", "andavo", "andrò"],
                    correct: 1
                },
                {
                    id: 'q-a2-2',
                    text: "Ogni mattina mi ___ alle sette.",
                    options: ["sveglio", "svegli", "svegliato", "svegliare"],
                    correct: 0
                }
            ]
        },
        {
            id: 's-b1',
            level: 'B1',
            title: 'Görüş Bildirme ve Varsayım',
            questions: [
                {
                    id: 'q-b1-1',
                    text: "Penso che questo film ___ molto interessante.",
                    options: ["è", "sia", "era", "sarà"],
                    correct: 1
                },
                {
                    id: 'q-b1-2',
                    text: "Se avessi più tempo, ___ di più.",
                    options: ["studio", "studierei", "ho studiato", "studiavo"],
                    correct: 1
                }
            ]
        },
        {
            id: 's-b2',
            level: 'B2',
            title: 'Karmaşık Anlatım ve Bağlaçlar',
            questions: [
                {
                    id: 'q-b2-1',
                    text: "Nonostante ___ stanco, ha finito il lavoro.",
                    options: ["è", "fosse", "sarebbe", "era"],
                    correct: 1
                },
                {
                    id: 'q-b2-2',
                    text: "È il libro di cui ti ___ parlato ieri.",
                    options: ["ho", "avevo", "avrei", "abbia"],
                    correct: 1
                }
            ]
        }
    ]
};

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function loadTestData() {
    try {
        const raw = localStorage.getItem(TEST_DATA_STORAGE_KEY);
        if (!raw) return deepClone(DEFAULT_TEST_DATA);
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.sections)) return deepClone(DEFAULT_TEST_DATA);
        return parsed;
    } catch (e) {
        console.warn('Sınav verisi okunamadı, varsayılan veriye dönülüyor.', e);
        return deepClone(DEFAULT_TEST_DATA);
    }
}

function saveTestData(data) {
    localStorage.setItem(TEST_DATA_STORAGE_KEY, JSON.stringify(data));
}

function resetTestData() {
    localStorage.removeItem(TEST_DATA_STORAGE_KEY);
}

function exportTestData(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seviye-tespit-sinavi.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function importTestDataFromFile(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!parsed || !Array.isArray(parsed.sections)) {
                throw new Error('Geçersiz sınav dosyası: "sections" alanı bulunamadı.');
            }
            onSuccess(parsed);
        } catch (err) {
            onError(err);
        }
    };
    reader.onerror = function () { onError(new Error('Dosya okunamadı.')); };
    reader.readAsText(file);
}

function generateId(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}
