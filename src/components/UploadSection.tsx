import { FC, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

const UploadSection: FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [publicLinks, setPublicLinks] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    university: '',
    course: '',
    professor: '',
    year: '',
    description: '',
    tags: '',
    price: ''
  });

  const subjects = [
    'Matematica', 'Fisica', 'Chimica', 'Biologia', 'Informatica',
    'Economia', 'Giurisprudenza', 'Medicina', 'Ingegneria', 'Lettere',
    'Filosofia', 'Psicologia', 'Sociologia', 'Storia dell\'Arte', 'Architettura'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const supabase = getSupabase();
    setUploading(true);
    try {
      const newEntries: any[] = [];
      const newLinks: string[] = [];
      for (const file of Array.from(files)) {
        const pricePrefix = formData.price ? `${formData.price}__` : '';
        const titlePrefix = formData.title ? `${formData.title}__` : '';
        const path = `${pricePrefix}${titlePrefix}${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const { error } = await supabase.storage.from('notes').upload(path, file, { upsert: false });
        if (error) {
          if ((error as any)?.message?.includes('Bucket not found')) {
            alert('Bucket "notes" non trovato. Crealo in Supabase → Storage con visibilità Public.');
          }
          throw error;
        }
        const { data } = supabase.storage.from('notes').getPublicUrl(path);
        newEntries.push({ name: file.name, size: file.size, type: file.type, status: 'uploaded', path });
        newLinks.push(data.publicUrl);
      }
      setUploadedFiles(prev => [...prev, ...newEntries]);
      setPublicLinks(prev => [...prev, ...newLinks]);
    } catch (e) {
      console.error(e);
      alert('Upload fallito. Configura Supabase (URL/KEY) e il bucket notes.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateNFTProbability = () => {
    const { title, description, subject, course } = formData;
    let score = 0;
    
    if (title.length > 20) score += 25;
    if (description.length > 100) score += 25;
    if (subject && course) score += 25;
    if (uploadedFiles.length > 0) score += 25;
    
    return Math.min(score, 95);
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.subject || !formData.university || !formData.price) {
      alert('Compila i campi obbligatori: Titolo, Materia, Università, Prezzo');
      return;
    }
    if (uploadedFiles.length === 0) {
      const proceed = window.confirm('Nessun file caricato. Vuoi pubblicare lo stesso?');
      if (!proceed) return;
    }
    const confirmMsg = `Pubblicare le note "${formData.title}" a ${formData.price}€?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      getSupabase();
      alert('Note pubblicate!');
    } catch (e) {
      console.error(e);
      alert('Pubblicazione fallita.');
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-6 py-3 rounded-full font-medium mb-6">
            <Upload className="w-5 h-5" />
            <span>Carica le tue Note</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Condividi la tua{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              conoscenza
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Carica i tuoi appunti migliori, guadagna dalla vendita e potresti vedere 
            le tue note trasformarsi in NFT unici!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* File Upload Area */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <File className="w-5 h-5 text-blue-600 mr-3" />
                Carica i tuoi File
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">
                  Trascina qui i tuoi file
                </h4>
                <p className="text-slate-600 mb-4">
                  Supportiamo PDF, DOC, DOCX, JPG, PNG fino a 50MB
                </p>
                <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full font-medium cursor-pointer hover:shadow-lg transition-all disabled:opacity-60">
                  <span>{uploading ? 'Caricamento…' : 'Seleziona File'}</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-slate-800">{file.name}</p>
                          <p className="text-sm text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      {publicLinks[index] ? (
                        <a className="text-blue-600 text-sm font-medium hover:underline" href={publicLinks[index]} target="_blank" rel="noreferrer">Apri</a>
                      ) : (
                        <span className="text-green-600 text-sm font-medium">Caricato</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note Details Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <BookOpen className="w-5 h-5 text-emerald-600 mr-3" />
                Dettagli della Nota
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Titolo delle Note *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Es. Analisi Matematica I - Limiti e Derivate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Materia *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleziona materia</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Università *
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Es. Università Bocconi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Corso di Laurea
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Es. Economia e Management"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Professore
                    </label>
                    <input
                      type="text"
                      name="professor"
                      value={formData.professor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome del professore"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Anno Accademico
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleziona anno</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                      <option value="2022/2023">2022/2023</option>
                      <option value="2021/2022">2021/2022</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Descrizione *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrivi il contenuto delle tue note, gli argomenti trattati e perché sono utili..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tag (separati da virgola)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="limiti, derivate, calcolo, matematica"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prezzo (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.50"
                      min="0.50"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12.99"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* NFT Probability */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                Probabilità NFT
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {calculateNFTProbability()}%
                </div>
                <p className="text-sm text-slate-600">
                  Possibilità di diventare NFT
                </p>
              </div>

              <div className="w-full bg-purple-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calculateNFTProbability()}%` }}
                ></div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Titolo completo</span>
                  <CheckCircle className={`w-4 h-4 ${formData.title.length > 20 ? 'text-green-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Descrizione dettagliata</span>
                  <CheckCircle className={`w-4 h-4 ${formData.description.length > 100 ? 'text-green-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Materia e corso</span>
                  <CheckCircle className={`w-4 h-4 ${formData.subject && formData.course ? 'text-green-600' : 'text-slate-300'}`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">File caricati</span>
                  <CheckCircle className={`w-4 h-4 ${uploadedFiles.length > 0 ? 'text-green-600' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                Consigli per il Successo
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    Note complete e ben organizzate vendono di più
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    Includi esempi e diagrammi per aumentare il valore
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    Contenuti unici hanno più probabilità di diventare NFT
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-600 rounded-full mt-2"></div>
                  <p className="text-slate-600">
                    Prezzi competitivi attraggono più acquirenti
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button onClick={handlePublish} className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Pubblica Note</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;