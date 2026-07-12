// Quick script to populate schemes data
fetch('https://bokbbzzjjiosknxwfpvb.supabase.co/functions/v1/populate-schemes-data', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva2Jienpqamlvc2tueHdmcHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDI0MjQsImV4cCI6MjA2NzA3ODQyNH0.dhCitX5fYeFJlWdkrrzHjD1rv0iKfcPyATIcywFB7Q0',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Schemes populated:', data))
.catch(err => console.error('Error:', err));