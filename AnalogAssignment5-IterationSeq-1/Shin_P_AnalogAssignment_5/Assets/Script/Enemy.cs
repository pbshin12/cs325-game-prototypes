using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    [System.Serializable]
    public class EnemyStats
    {
        public int maxHealth = 100;
        private int currHealth;

        // Apparently you can do getters and setters this way
        public int curHealth
        {
            get { return this.currHealth; }
            set { currHealth = (int)Mathf.Clamp(value, 0f, maxHealth); }
        }

        // Constructor method, initialize max health of enemy
        public EnemyStats()
        {
            this.curHealth = maxHealth;
        }

    }

    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------

    public Transform explosionPrefab;

    AudioSource audioSource;
    public AudioClip minionHurtSound;
    public AudioClip minionExplosionSound;

    public EnemyStats stats = new EnemyStats();


    private void Start()
    {

        stats.curHealth = stats.maxHealth;
        audioSource = GetComponent<AudioSource>();
    }

    public void DamageEnemy(int damage)
    {
        stats.curHealth -= damage;
        audioSource.PlayOneShot(minionHurtSound, 0.8f);

        if (stats.curHealth <= 0)
        {
            stats.curHealth = 0;
            Debug.Log("Enemy: " + this.ToString() + " is dead");
            Instantiate(explosionPrefab, transform.position, Quaternion.identity);

            AudioSource.PlayClipAtPoint(minionExplosionSound, new Vector3(0, 0, -10));
            Destroy(gameObject);

        }

    }

}
