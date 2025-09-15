import { FC, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Sparkles, BookOpen, Wallet } from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { aiService } from '../services/aiService';
import { Document } from '../types/database';
import { v4 as uuidv4 } from 'uuid';

const UploadSection: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    university: '',
    course: '',
    professor: '',
    year: '',
    description: '',
    tags: '',
    price: '',
    is_free: false
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
    if (!isAuthenticated) {
      alert('Devi connettere il wallet per caricare i file.');
      return;
    }

    const supabase = getSupabase();
    setUploading(true);
    try {
      const newEntries: any[] = [];
      for (const file of Array.from(files)) {
        const fileId = uuidv4();
        const path = `documents/${user?.id}/${fileId}-${file.name}`;
        const { error } = await supabase.storage.from('notes').upload(path, file, { upsert: false });
        if (error) {
          if ((error as any)?.message?.includes('Bucket not found')) {
            alert('Bucket "notes" non trovato. Crealo in Supabase → Storage con visibilità Public.');
          }
          throw error;
        }
        const { data } = supabase.storage.from('notes').getPublicUrl(path);
        newEntries.push({ 
          id: fileId,
          name: file.name, 
          size: file.size, 
          type: file.type, 
          status: 'uploaded', 
          path,
          url: data.publicUrl
        });
      }
      setUploadedFiles(prev => [...prev, ...newEntries]);
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
    if (!isAuthenticated || !user) {
      alert('Devi connettere il wallet per pubblicare.');
      return;
    }

    if (!formData.title || !formData.subject || !formData.university) {
      alert('Compila i campi obbligatori: Titolo, Materia, Università');
      return;
    }

    if (!formData.is_free && !formData.price) {
      alert('Inserisci un prezzo o seleziona "Gratuito"');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('Carica almeno un file prima di pubblicare.');
      return;
    }

    const confirmMsg = formData.is_free 
      ? `Pubblicare le note "${formData.title}" gratuitamente?`
      : `Pubblicare le note "${formData.title}" a ${formData.price} ETH?`;
    if (!window.confirm(confirmMsg)) return;

    setPublishing(true);
    try {
      const supabase = getSupabase();
      
      // Get AI summary for the document
      const mainFile = uploadedFiles[0];
      let aiSummary = null;
      try {
        // Extract text from PDF if it's a PDF file
        let content = 'Document content placeholder';
        if (mainFile.type === 'application/pdf') {
          // In production, extract actual text from PDF
          content = await aiService.extractTextFromPDF(mainFile as File);
        }
        
        const summary = await aiService.summarizeDocument(content, formData.title, formData.subject);
        aiSummary = JSON.stringify(summary);
      } catch (aiError) {
        console.warn('AI summary failed:', aiError);
        // Continue without AI summary
      }

      // Create document record
      const documentData: Partial<Document> = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        university: formData.university,
        course: formData.course || undefined,
        professor: formData.professor || undefined,
        academic_year: formData.year || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        price_eth: formData.is_free ? 0 : parseFloat(formData.price),
        is_free: formData.is_free,
        file_url: mainFile.url,
        file_name: mainFile.name,
        file_size: mainFile.size,
        file_type: mainFile.type,
        upload_path: mainFile.path,
        ai_summary: aiSummary,
        downloads_count: 0,
        purchases_count: 0,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('documents')
        .insert(documentData);

      if (error) throw error;

      alert('Note pubblicate con successo!');
      
      // Reset form
      setFormData({
        title: '',
        subject: '',
        university: '',
        course: '',
        professor: '',
        year: '',
        description: '',
        tags: '',
        price: '',
        is_free: false
      });
      setUploadedFiles([]);
    } catch (e) {
      console.error(e);
      alert('Pubblicazione fallita. Riprova.');
    } finally {
      setPublishing(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200">
            <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Connetti il tuo Wallet
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Per caricare e vendere le tue note, devi prima connettere il tuo wallet MetaMask.
            </p>
            <button 
              onClick={() => window.location.href = '#'}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Torna al Header per Connettere
            </button>
          </div>
        </div>
      </section>
    );
  }

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
                      {file.url ? (
                        <a className="text-blue-600 text-sm font-medium hover:underline" href={file.url} target="_blank" rel="noreferrer">Apri</a>
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
                      Prezzo
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="is_free"
                          name="is_free"
                          checked={formData.is_free}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_free: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_free" className="text-sm text-slate-700">
                          Download gratuito
                        </label>
                      </div>
                      {!formData.is_free && (
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.001"
                          min="0.001"
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.01"
                        />
                      )}
                      {!formData.is_free && (
                        <p className="text-xs text-slate-500">
                          Prezzo in ETH (es. 0.01 ETH = ~$25)
                        </p>
                      )}
                    </div>
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
            <button 
              onClick={handlePublish} 
              disabled={publishing || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <Upload className="w-5 h-5" />
              <span>{publishing ? 'Pubblicazione...' : 'Pubblica Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;