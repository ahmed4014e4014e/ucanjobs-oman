import { useEffect, useState } from "react";
import { Button, Field } from "../../../../components/ui";
import {
  createApiClient,
  listApiClients,
  revokeApiClient,
} from "../../../../lib/profileSettingsApi";
import { formatDateTime } from "../../profileDisplay";
import SectionFrame from "../SectionFrame";

export default function ApiClientsSection({ user, meta }) {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [newSecret, setNewSecret] = useState("");

  const loadClients = async () => {
    if (!user?.id) {
      setClients([]);
      return;
    }
    const rows = await listApiClients(user.id);
    setClients(rows);
  };

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setFeedback(null);
      try {
        await loadClients();
      } catch (error) {
        if (!active) return;
        setFeedback({
          type: "error",
          title: "Load failed",
          message: error?.message || "Could not load API clients.",
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setCreating(true);
    setFeedback(null);
    setNewSecret("");

    try {
      const created = await createApiClient(name);
      setName("");
      setNewSecret(created.api_key || created.apiKey || "");
      await loadClients();
      setFeedback({
        type: "success",
        title: "API client created",
        message: "Copy the secret key now. You will not be able to see it again.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Create failed",
        message: error?.message || "Could not create API client.",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (clientId) => {
    setFeedback(null);
    try {
      await revokeApiClient(clientId);
      await loadClients();
      setFeedback({
        type: "success",
        title: "Revoked",
        message: "That API client can no longer be used.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        title: "Revoke failed",
        message: error?.message || "Could not revoke API client.",
      });
    }
  };

  const activeClients = clients.filter((client) => !client.revoked_at);
  const revokedClients = clients.filter((client) => client.revoked_at);

  return (
    <SectionFrame title={meta.title} description={meta.description} feedback={feedback}>
      <form className="space-y-4 rounded-3xl oman-outline-panel p-5" onSubmit={handleCreate}>
        <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Create API client</h3>
        <Field
          label="Client name"
          name="api_client_name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Local scripts"
        />
        <Button type="submit" loading={creating} disabled={creating}>
          Create client
        </Button>
      </form>

      {newSecret ? (
        <div className="mt-6 rounded-3xl border border-[rgba(197,154,68,0.35)] bg-[rgba(244,232,214,0.45)] p-5">
          <p className="font-semibold text-[var(--oman-ink)]">Secret key (copy now)</p>
          <code className="mt-3 block break-all rounded-2xl bg-white px-4 py-3 text-sm text-[var(--oman-ink)]">
            {newSecret}
          </code>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(newSecret);
                setFeedback({
                  type: "success",
                  title: "Copied",
                  message: "API key copied to clipboard.",
                });
              } catch (_error) {
                setFeedback({
                  type: "error",
                  title: "Copy failed",
                  message: "Select the key and copy it manually.",
                });
              }
            }}
          >
            Copy secret
          </Button>
        </div>
      ) : null}

      {loading ? (
        <p className="mt-6 text-[var(--oman-ink)]/75">Loading clients…</p>
      ) : (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Active clients</h3>
            {activeClients.length === 0 ? (
              <p className="mt-3 text-[var(--oman-ink)]/75">No active API clients.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {activeClients.map((client) => (
                  <li
                    key={client.id}
                    className="flex flex-col gap-3 rounded-3xl oman-outline-panel p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[var(--oman-ink)]">{client.name}</p>
                      <p className="mt-1 text-sm text-[var(--oman-ink)]/70">
                        Prefix <code>{client.key_prefix}…</code> · Created{" "}
                        {formatDateTime(client.created_at)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleRevoke(client.id)}
                    >
                      Revoke
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {revokedClients.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-[var(--oman-ink)]">Revoked</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--oman-ink)]/70">
                {revokedClients.map((client) => (
                  <li key={client.id}>
                    {client.name} ({client.key_prefix}…) · revoked{" "}
                    {formatDateTime(client.revoked_at)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </SectionFrame>
  );
}
