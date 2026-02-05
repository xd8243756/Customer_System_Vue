(function(){
  const api = axios.create({ baseURL: 'http://localhost:5212/api' });

  function qs(name){ const p = new URLSearchParams(location.search); return p.get(name); }
  const id = qs('id');

  const form = document.getElementById('editForm');
  const fields = {
    ComplaintId: form.elements['ComplaintId'],
    CaseId: form.elements['CaseId'],
    CustomerId: form.elements['CustomerId'],
    IssueTypeId: form.elements['IssueTypeId'],
    ComplaintSeverity: form.elements['ComplaintSeverity'],
    ComplaintStartAt: form.elements['ComplaintStartAt'],
    ComplaintAcceptedAt: form.elements['ComplaintAcceptedAt'],
    ComplaintAcceptedBy: form.elements['ComplaintAcceptedBy'],
    ComplaintManagerId: form.elements['ComplaintManagerId'],
    ComplaintDescription: form.elements['ComplaintDescription']
  };

  async function loadOptions(){
    try{
      const [r1, r2, r3, r4] = await Promise.all([
        api.get('/TimMovE_ComplaintCase_/types'),
        api.get('/TimMovE_ComplaintCase_/staff'),
        api.get('/TimMovE_ComplaintCase_/GetCaseName'),
        api.get('/TimMovE_ComplaintCase_/SelectCustomer')
      ]);

      populateSelect(fields.IssueTypeId, r1.data, 'issueTypeId', 'issueTypeName', '請選擇客訴類型');
      populateSelect(fields.ComplaintAcceptedBy, r2.data, 'employeeId', 'employeeName', '請選擇受理人員');
      populateSelect(fields.ComplaintManagerId, r2.data, 'employeeId', 'employeeName', '請選擇負責人');
      populateSelect(fields.CaseId, r3.data, 'caseId', 'caseNo', '請選擇訂單編號');
      populateSelect(fields.CustomerId, r4.data, 'customerId', 'customerName', '請選擇客戶姓名');

    }catch(e){ console.error('載入選項失敗', e); }
  }

  function populateSelect(sel, items, valueKey, textKey, placeholder){
    sel.innerHTML = `<option selected disabled hidden>${placeholder || '請選擇'}</option>`;
    (items||[]).forEach(it=>{
      const o = document.createElement('option'); o.value = it[valueKey] ?? it.id ?? ''; o.textContent = it[textKey] ?? it.name ?? ''; sel.appendChild(o);
    });
  }

  async function loadDetail(){
    if(!id) return;
    try{
      const res = await api.get(`/TimMovE_ComplaintCase_/${id}`);
      const d = res.data;
      fields.ComplaintId.value = d.客訴紀錄編號 || d.complaintId || id;
      // try to set selects by id; if the detail doesn't include IDs, try to match by text
      setSelectValue(fields.CaseId, d.對應訂單編號 || d.caseId);
      setSelectValueByText(fields.CustomerId, d.客戶姓名);
      setSelectValue(fields.IssueTypeId, d.issueTypeId || d.客訴類型編號);
      fields.ComplaintSeverity.value = d.案件嚴重度 || d.complaintSeverity || '';
      fields.ComplaintStartAt.value = d.客訴日期formatted || d.客訴日期 || d.complaintStartAt || '';
      fields.ComplaintAcceptedAt.value = d.受理日期formatted || d.受理日期 || d.complaintAcceptedAt || '';
      setSelectValueByText(fields.ComplaintAcceptedBy, d.受理人員 || d.complaintAcceptedBy);
      setSelectValueByText(fields.ComplaintManagerId, d.案件負責人 || d.complaintManagerId);
      fields.ComplaintDescription.value = d.客訴內容 || d.complaintDescription || '';

    }catch(e){ console.error('載入明細失敗', e); }
  }

  function setSelectValue(sel, val){ if(!val) return; const opt = Array.from(sel.options).find(o=> o.value == val); if(opt) sel.value = opt.value; }
  function setSelectValueByText(sel, text){ if(!text) return; const opt = Array.from(sel.options).find(o=> o.textContent.trim() == (text || '').toString().trim()); if(opt) sel.value = opt.value; }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    try{
      const payload = {
        caseId: fields.CaseId.value || undefined,
        customerId: fields.CustomerId.value || undefined,
        issueTypeId: fields.IssueTypeId.value || undefined,
        complaintDescription: fields.ComplaintDescription.value || '',
        complaintSeverity: fields.ComplaintSeverity.value || '',
        complaintAcceptedBy: fields.ComplaintAcceptedBy.value || undefined,
        complaintManagerId: fields.ComplaintManagerId.value || undefined,
        complaintStartAt: fields.ComplaintStartAt.value || undefined,
        complaintAcceptedAt: fields.ComplaintAcceptedAt.value || undefined
      };
      const idToUpdate = fields.ComplaintId.value || id;
      await api.put(`/TimMovE_ComplaintCase_/${idToUpdate}`, payload, { headers:{ 'Content-Type':'application/json' } });
      alert('客訴案件儲存成功！');
      // notify parent if exists
      if(window.parent && window.parent !== window){ try{ if(typeof window.parent.fetchCases === 'function') window.parent.fetchCases(); }catch(e){} try{ if(typeof window.parent.closeEditCustomerOverlay === 'function') window.parent.closeEditCustomerOverlay(); }catch(e){} }
      else { window.location.href = 'Customer_System.html'; }
    }catch(err){ console.error('儲存失敗', err); alert('儲存失敗，請稍後再試。'); }
  });

  document.getElementById('btnCancel').addEventListener('click', function(){
    if(window.parent && window.parent !== window && typeof window.parent.closeEditCustomerOverlay === 'function'){
      try{ window.parent.closeEditCustomerOverlay(); }catch(e){}
    } else { history.back(); }
  });

  // init: load options first so setSelectValue works after
  (async function init(){ await loadOptions(); await loadDetail(); })();

})();