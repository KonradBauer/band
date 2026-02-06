"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      message: "",
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-heading text-primary font-bold">
          Dziękujemy za wiadomość!
        </h3>
        <p className="text-muted-foreground mt-2">
          Skontaktujemy się z Tobą najszybciej jak to możliwe.
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Wyślij kolejną wiadomość
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Imię i nazwisko"
          required
          className="bg-background border-border"
        />
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Adres e-mail"
          required
          className="bg-background border-border"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Numer telefonu"
          className="bg-background border-border"
        />
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">
            Planowana data wesela
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-background border-border"
          />
        </div>
      </div>

      <Textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Twoja wiadomość..."
        rows={5}
        required
        className="bg-background border-border"
      />

      <Button
        type="submit"
        variant="default"
        className="w-full text-lg py-6"
      >
        Wyślij wiadomość
      </Button>
    </form>
  )
}
