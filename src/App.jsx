
import { useEffect, useRef, useState } from 'react'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import {
  Upload,
  Download,
  FileText,
  RotateCw,
  Type,
  ShieldCheck,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle
} from 'lucide-react'
import About from './About.jsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function App() {
  const inputRef = useRef(null)
  const canvasRef = useRef(null)

  const [file, setFile] = useState(null)
  const [sourceBytes, setSourceBytes] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [text, setText] = useState('')
  const [x, setX] = useState('60')
  const [y, setY] = useState('70')
  const [fontSize, setFontSize] = useState('18')
  const [busy, setBusy] = useState(false)

  const [showAbout, setShowAbout] = useState(
    () => window.location.hash === '#about'
  )

  // Keep the displayed page synchronized with the URL.
  useEffect(() => {
    function syncPage() {
      setShowAbout(window.location.hash === '#about')
    }

    window.addEventListener('hashchange', syncPage)

    return () => {
      window.removeEventListener('hashchange', syncPage)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function renderPage() {
      if (!pdf || !canvasRef.current) return

      try {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({
          scale: Math.min(
            1.35,
            760 / page.getViewport({ scale: 1 }).width
          )
        })

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = viewport.width
        canvas.height = viewport.height

        if (!cancelled) {
          await page.render({
            canvasContext: context,
            viewport
          }).promise
        }
      } catch (e) {
        if (!cancelled) {
          setError('Could not render this page. Try another PDF.')
        }
      }
    }

    renderPage()

    return () => {
      cancelled = true
    }
  }, [pdf, pageNum])

  function navigateToAbout() {
    if (window.location.hash !== '#about') {
      window.location.hash = 'about'
    } else {
      setShowAbout(true)
    }
  }

  function navigateHome() {
    if (window.location.hash) {
      window.history.pushState(
        {},
        document.title,
        window.location.pathname + window.location.search
      )
    }

    setShowAbout(false)
  }

  async function openFile(selected) {
    if (!selected) return

    if (
      selected.type !== 'application/pdf' &&
      !selected.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Please choose a PDF file.')
      return
    }

    setLoading(true)
    setError('')
    setNotice('')

    try {
      const bytes = await selected.arrayBuffer()

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(bytes.slice(0))
      })

      const loadedPdf = await loadingTask.promise

      setFile(selected)
      setSourceBytes(bytes)
      setPdf(loadedPdf)
      setPageCount(loadedPdf.numPages)
      setPageNum(1)

      setNotice('PDF opened successfully. Your file stays in this browser.')
    } catch (e) {
      setError(
        'This PDF could not be opened. It may be damaged, encrypted, or unsupported.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function downloadEdited() {
    if (!sourceBytes) return

    setBusy(true)
    setError('')

    try {
      const doc = await PDFDocument.load(sourceBytes.slice(0))
      const page = doc.getPage(pageNum - 1)
      const font = await doc.embedFont(StandardFonts.Helvetica)

      const px = Math.max(0, Number(x) || 0)
      const py = Math.max(0, Number(y) || 0)
      const size = Math.min(120, Math.max(6, Number(fontSize) || 18))

      if (text.trim()) {
        page.drawText(text.trim(), {
          x: px,
          y: py,
          size,
          font,
          color: rgb(0.05, 0.35, 0.95),
          maxWidth: Math.max(80, page.getWidth() - px - 20)
        })
      }

      const bytes = await doc.save()

      saveBlob(
        new Blob([bytes], { type: 'application/pdf' }),
        `jj-creationz-${file?.name || 'document.pdf'}`
      )

      setNotice(
        text.trim()
          ? `Text added to page ${pageNum}. Download started.`
          : 'A copy of your PDF has been downloaded.'
      )
    } catch (e) {
      setError(
        'Could not save this PDF. It may use encryption or unsupported features.'
      )
    } finally {
      setBusy(false)
    }
  }

  async function rotateCurrentPage() {
    if (!sourceBytes) return

    setBusy(true)
    setError('')

    try {
      const doc = await PDFDocument.load(sourceBytes.slice(0))
      const page = doc.getPage(pageNum - 1)

      page.setRotation(degrees((page.getRotation().angle + 90) % 360))

      const bytes = await doc.save()

      saveBlob(
        new Blob([bytes], { type: 'application/pdf' }),
        `jj-creationz-rotated-${file?.name || 'document.pdf'}`
      )

      setNotice(`Rotated page ${pageNum} in the downloaded copy.`)
    } catch {
      setError('Could not rotate this page in the current PDF.')
    } finally {
      setBusy(false)
    }
  }

  function saveBlob(blob, name) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = name.replace(/[^\w.\-() ]/g, '_')

    document.body.appendChild(a)
    a.click()
    a.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1500)
  }

  function reset() {
    setFile(null)
    setSourceBytes(null)
    setPdf(null)
    setPageCount(0)
    setPageNum(1)
    setError('')
    setNotice('')
    setText('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="./"
          aria-label="JJ Creationz home"
          onClick={(e) => {
            if (showAbout) {
              e.preventDefault()
              navigateHome()
            }
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="JJ Creationz logo"
            className="brand-logo"
          />
          <span className="brand-copy">
            <strong>JJ <em>CREATIONZ</em></strong>
            <small>PDF STUDIO</small>
          </span>
        </a>

        <nav className="about-nav" aria-label="Main navigation">
          {showAbout ? (
            <a href="./" onClick={(e) => {
              e.preventDefault()
              navigateHome()
            }}>
              PDF Studio
            </a>
          ) : (
            <a href="#about" onClick={navigateToAbout}>
              About Us
            </a>
          )}
        </nav>
      </header>

      {showAbout ? (
        <About onBack={navigateHome} />
      ) : (
        <main>
          <section className="hero">
            <div className="eyebrow">
              <Sparkles size={15} />
              YOUR DOCUMENT WORKSPACE
            </div>

            <h1>
              PDF work, <span>without the busywork.</span>
            </h1>

            <p>
              Open a PDF, add text, and download your edited copy. Simple tools,
              a clean workspace, and your documents processed in your browser.
            </p>

            <div className="hero-meta">
              <span><span className="status-dot" /> No daily task counter</span>
              <span>•</span>
              <span>Browser-based processing</span>
            </div>
          </section>

          {!file ? (
            <section
              className="dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                openFile(e.dataTransfer.files?.[0])
              }}
            >
              <div className="upload-icon">
                <Upload size={27} />
              </div>

              <h2>Start with a PDF</h2>
              <p>Choose a document from your device to begin.</p>

              <button
                className="primary-btn"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={17} />
                Choose PDF
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                hidden
                onChange={(e) => openFile(e.target.files?.[0])}
              />

              <div className="drop-hint">
                or drag and drop your file here
              </div>

              <div className="local-note">
                <ShieldCheck size={15} />
                Your file is processed locally in this browser.
              </div>
            </section>
          ) : (
            <section className="workspace">
              <div className="workspace-head">
                <div className="file-summary">
                  <div className="file-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <strong>{file.name}</strong>
                    <small>
                      {formatBytes(file.size)} · {pageCount} page
                      {pageCount === 1 ? '' : 's'}
                    </small>
                  </div>
                </div>

                <button className="ghost-btn" onClick={reset}>
                  <X size={15} />
                  Close PDF
                </button>
              </div>

              <div className="editor-grid">
                <div className="preview-panel">
                  <div className="preview-toolbar">
                    <span>
                      <FileText size={15} />
                      Page preview
                    </span>

                    <div className="page-controls">
                      <button
                        aria-label="Previous page"
                        disabled={pageNum <= 1}
                        onClick={() => setPageNum((p) => p - 1)}
                      >
                        <ChevronLeft size={17} />
                      </button>

                      <span>{pageNum} / {pageCount}</span>

                      <button
                        aria-label="Next page"
                        disabled={pageNum >= pageCount}
                        onClick={() => setPageNum((p) => p + 1)}
                      >
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="canvas-wrap">
                    {loading ? (
                      <LoaderCircle className="spin" />
                    ) : (
                      <canvas ref={canvasRef} />
                    )}
                  </div>

                  <p className="preview-caption">
                    Preview is for reference. New text is placed using PDF page
                    coordinates.
                  </p>
                </div>

                <aside className="tools-panel">
                  <div className="panel-title">
                    <Type size={17} />
                    <div>
                      <strong>Add text</strong>
                      <small>Place new text on the current page</small>
                    </div>
                  </div>

                  <label>
                    Text to add
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type something to add to the PDF…"
                      rows={4}
                    />
                  </label>

                  <div className="field-row">
                    <label>
                      Horizontal position (pt)
                      <input
                        type="number"
                        min="0"
                        value={x}
                        onChange={(e) => setX(e.target.value)}
                      />
                    </label>

                    <label>
                      Vertical position (pt)
                      <input
                        type="number"
                        min="0"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    Font size
                    <input
                      type="number"
                      min="6"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                    />
                  </label>

                  <div className="hint-box">
                    Tip: PDF coordinates start at the bottom-left of the page.
                    The default position is a starting point; use a PDF viewer
                    to fine-tune placement.
                  </div>

                  <button
                    className="primary-btn wide"
                    disabled={busy}
                    onClick={downloadEdited}
                  >
                    <Download size={17} />
                    {busy
                      ? 'Preparing PDF…'
                      : text.trim()
                        ? 'Add text & download'
                        : 'Download a copy'}
                  </button>

                  <button
                    className="secondary-btn wide"
                    disabled={busy}
                    onClick={rotateCurrentPage}
                  >
                    <RotateCw size={16} />
                    Rotate page & download
                  </button>
                </aside>
              </div>
            </section>
          )}

          {error && (
            <div className="message error" role="alert">
              {error}
            </div>
          )}

          {notice && !error && (
            <div className="message success" role="status">
              {notice}
            </div>
          )}

          <section className="feature-row">
            <article>
              <div className="feature-icon">
                <ShieldCheck size={19} />
              </div>
              <strong>Private by design</strong>
              <p>
                Your PDF is handled in the browser. This starter doesn't upload
                documents to a server.
              </p>
            </article>

            <article>
              <div className="feature-icon">
                <Type size={19} />
              </div>
              <strong>Useful essentials</strong>
              <p>
                Preview pages, add text overlays, rotate a page, and download a
                fresh copy.
              </p>
            </article>

            <article>
              <div className="feature-icon">
                <Sparkles size={19} />
              </div>
              <strong>Built to grow</strong>
              <p>
                We can add page management, annotations, merging, splitting,
                and more next.
              </p>
            </article>
          </section>
        </main>
      )}

      <footer>
        <div className="footer-brand">
          JJ <span>CREATIONZ</span>
        </div>
        <p>Made for ideas that move forward.</p>
        <small>
          © {new Date().getFullYear()} JJ Creationz · PDF Studio
        </small>
      </footer>
    </div>
  )
}
