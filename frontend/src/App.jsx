import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hello')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.log("Le backend n'est pas encore lancé"))
  }, [])

  return (
    // "min-h-screen" : prend toute la hauteur du téléphone
    // "bg-slate-900" : fond sombre moderne
    // "p-4" : marge interne pour que le contenu ne touche pas les bords du téléphone
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-sm bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">Mon App Mobile</h1>
        <p className="text-slate-400 mb-6">Projet Fullstack : Laravel + React</p>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
          <span className="text-xs uppercase tracking-widest text-blue-500 font-semibold">Statut Backend :</span>
          <p className="mt-1 text-sm italic">
            {data ? data.message : "Connexion au cerveau PHP..."}
          </p>
        </div>

        <button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all py-3 rounded-xl font-bold">
          Commencer
        </button>
      </div>

    </div>
  )
}

export default App