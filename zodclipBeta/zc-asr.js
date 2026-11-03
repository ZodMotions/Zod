// ZodClip Beta — tarayıcıda konuşmayı yazıya çeviren işçi (Whisper, transformers.js)
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2';
env.allowLocalModels = false;

let asr = null, loaded = '';
const post = m => self.postMessage(m);

self.onmessage = async e => {
  const { audio, model, lang } = e.data;
  try {
    if (!asr || loaded !== model) {
      post({ type: 'status', msg: 'Yapay zekâ modeli hazırlanıyor…', p: .02 });
      asr = await pipeline('automatic-speech-recognition', model, {
        dtype: 'q8', device: 'wasm',
        progress_callback: p => { if (p.status === 'progress') post({ type: 'dl', file: p.file, loaded: p.loaded, total: p.total }); }
      });
      loaded = model;
    }
    post({ type: 'status', msg: 'Konuşma yazıya çevriliyor… (uzun videolarda birkaç dakika sürebilir)', p: .7 });
    const opts = { language: lang, task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 };
    let out;
    try { out = await asr(audio, { ...opts, return_timestamps: 'word' }); }
    catch (err) { out = await asr(audio, { ...opts, return_timestamps: true }); }
    post({ type: 'done', chunks: out.chunks || [], text: out.text || '' });
  } catch (err) {
    post({ type: 'error', msg: String(err && err.message || err) });
  }
};
